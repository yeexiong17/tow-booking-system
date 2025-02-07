import { useState, useEffect } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { useNavigate } from 'react-router-dom'
import { Paper, Title, Text, Button, Container, Alert, Space } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useAuth } from '../../Context'
import { supabase } from '../../supabase'

const Rejected = ({ towDriverDetails }) => {
    const [rejectionReason, setRejectionReason] = useState('')
    const navigate = useNavigate()
    const { signOut, toggle } = useAuth()

    useEffect(() => {
        // Fetch rejection reason when component mounts
        const fetchRejectionReason = async () => {
            // TODO: Implement fetching rejection reason from your data source
            setRejectionReason('Your license documentation was unclear. Please provide a clearer image.')
        }

        fetchRejectionReason()
    }, [])

    const handleResubmit = async () => {
        try {
            toggle()
            const { error: dbError } = await supabase
                .from('tow_driver_details')
                .delete()
                .eq('id', towDriverDetails.id)

            if (dbError) throw dbError

            const { data: files, error: listError } = await supabase
                .storage
                .from('bucket')
                .list(`tow_driver_details_image/${towDriverDetails.user_id}`)

            if (listError) throw listError

            if (files && files.length > 0) {
                const filePaths = files.map(file =>
                    `tow_driver_details_image/${towDriverDetails.user_id}/${file.name}`
                )

                const { error: deleteError } = await supabase
                    .storage
                    .from('bucket')
                    .remove(filePaths)

                if (deleteError) throw deleteError
            }

            window.location.reload()
        } catch (error) {
            console.error('Error during resubmission:', error)
        } finally {
            toggle()
        }
    }

    return (
        <CommonLayout navShouldShow={false}>
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="Application Rejected"
                color="red"
                mb="lg"
            >
                Your tow driver application has been rejected.
            </Alert>

            <Title order={4} mb="xs">Reason for Rejection:</Title>
            <Paper withBorder p="md" mb="xl" bg="gray.0">
                <Text>
                    {rejectionReason || 'No reason provided'}
                </Text>
            </Paper>

            <Button
                onClick={handleResubmit}
                color="blue"
                size="md"
                fullWidth
            >
                Submit New Application
            </Button>

            <Space h={20} />

            <Button size='md' onClick={() => signOut()} color="red" fullWidth mt="md" radius="md">Log Out</Button>

        </CommonLayout>
    )
}

export default Rejected
