import { useCallback, useEffect, useState } from "react"
import { Button, Card, Drawer, Group, Image, Space, Text } from "@mantine/core"
import CommonLayout from "../components/CommonLayout"
import { useDisclosure } from "@mantine/hooks"
import { useAuth } from "../Context"
import { useNavigate } from "react-router-dom"
import { convertToMalaysiaTime } from "../helpers/HelperFunction"
import { supabase } from "../supabase"

const Profile = () => {
    const { signOut, userData } = useAuth()
    const [opened, { open, close }] = useDisclosure(false)
    const [profileData, setProfileData] = useState(null)
    const navigate = useNavigate()

    const fetchProfileData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userData.id)
                .single()

            if (error) throw error

            setProfileData(data)
        } catch (error) {
            console.error('Error fetching profile:', error)
        }
    }, [userData.id])

    useEffect(() => {
        open()
        fetchProfileData()
    }, [open, fetchProfileData])

    const handleClose = () => {
        close()
        navigate(-1)
    }

    return (
        <CommonLayout>
            <Drawer
                position="bottom"
                size="100%"
                onClose={handleClose}
                opened={opened}
                title='Profile'
                styles={() => ({
                    title: {
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                    },
                })}
            >
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Card.Section>
                        <Image
                            src={profileData?.profile_picture || 'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg'}
                            height={50}
                        />
                    </Card.Section>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700}>Basic Information:</Text>
                    </Group>

                    <Text size="sm" fw={500}>ID      : <span className="font-normal">{profileData?.id}</span></Text>
                    <Text size="sm" fw={500}>Username: <span className="font-normal">{profileData?.name}</span></Text>
                    <Text size="sm" fw={500}>Role    : <span className="font-normal">{profileData?.role}</span></Text>
                    <Text size="sm" fw={500}>Status  : <span className="font-normal">{profileData?.status}</span></Text>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700}>Contact Information:</Text>
                    </Group>

                    <Text size="sm" fw={500}>Email   : <span className="font-normal">{profileData?.email}</span></Text>
                    <Text size="sm" fw={500}>Phone: <span className="font-normal">{profileData?.phone || 'No phone added'}</span></Text>
                    <Text size="sm" fw={500}>Date Time Joined: <span className="font-normal">{convertToMalaysiaTime(userData.created_at)}</span></Text>
                </Card>
                <Button size='md' onClick={() => signOut()} color="red" fullWidth mt="md" radius="md">Log Out</Button>
            </Drawer>
        </CommonLayout>
    )
}

export default Profile
