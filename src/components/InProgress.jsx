import { Stack, Space, Button } from '@mantine/core'
import loadingGif from '../images/loading.gif'
import { useNavigate } from 'react-router-dom'
import { IconArrowNarrowRight } from '@tabler/icons-react'

const InProgress = () => {

    const navigate = useNavigate()

    return (
        <Stack align="center">
            <img src={loadingGif} alt="Loading..." className=" w-20 h-20 mx-auto mt-10" />
            <Space h="lg" />
            <Stack
                className="bg-blue-300 rounded-lg shadow-md p-4 w-full max-w-xl text-center"
            >
                <p className="text-lg font-semibold text-gray-800">In Progress</p>
                <Button variant="default" onClick={() => navigate('/history')}>View Booking <IconArrowNarrowRight stroke={2} /></Button>
            </Stack>

        </Stack>
    )
}

export default InProgress
