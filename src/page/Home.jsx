import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Stack } from '@mantine/core'

import CommonLayout from '../components/CommonLayout'
import { useAuth } from '../Context'
import PhoneModal from '../components/PhoneModal'

const Home = () => {
    const { signOut, userData } = useAuth()
    const [hasPhone, setHasPhone] = useState(true)
    const { user_metadata } = userData
    const navigate = useNavigate();

    useEffect(() => {
        if (userData.phone.length > 0) {
            setHasPhone(true)
        }
    }, [])

    return (
        <CommonLayout>
            <PhoneModal hasPhone={hasPhone} />

            <Stack>
                <p className="font-bold text-2xl text-neutral-800 mb-5">Welcome, {`${user_metadata.name}`}</p>
                <Button variant="filled" onClick={() => navigate('/VehicleDetails')} size="md" radius="md">Request Towing</Button>
                <Button onClick={() => signOut()}>Log Out</Button>
            </Stack>
        </CommonLayout>
    )
}

export default Home
