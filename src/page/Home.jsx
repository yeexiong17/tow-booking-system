import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Stack, Image } from '@mantine/core'

import CommonLayout from '../components/CommonLayout'
import { useAuth } from '../Context'
import PhoneModal from '../components/PhoneModal'
import Booking2 from '../images/booking-2.jpg'

const Home = () => {
    const { signOut, userData } = useAuth()
    const [hasPhone, setHasPhone] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (userData?.phone) {
            setHasPhone(true)
        }
    }, [userData])

    return (
        <CommonLayout>
            <PhoneModal hasPhone={hasPhone} />

            <Stack>
                <p className="font-bold text-2xl text-neutral-800 mb-5">Welcome, {`${userData.user_metadata.name}`}</p>
                <Image
                    radius="md"
                    src={Booking2}
                />
                <Button variant="filled" onClick={() => navigate('/request-tow')} size="md" radius="md">Request Towing</Button>
            </Stack>
        </CommonLayout>
    )
}

export default Home
