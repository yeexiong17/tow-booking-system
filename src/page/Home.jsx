import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Stack, Image } from '@mantine/core'

import CommonLayout from '../components/CommonLayout'
import { useAuth } from '../Context'
import PhoneModal from '../components/PhoneModal'
import Booking2 from '../images/booking-2.jpg'
import { supabase } from '../supabase'

const Home = () => {
    const { signOut, userData } = useAuth()
    const [hasPhone, setHasPhone] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getUserDetails()
    }, [])

    const getUserDetails = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.id)

        console.log(data[0])
        if (data[0].phone == '') {
            setHasPhone(false)
        }
    }

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
