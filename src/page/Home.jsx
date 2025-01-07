import { useEffect, useState } from 'react'

import { Button, Stack } from '@mantine/core'

import CommonLayout from '../components/CommonLayout'
import { useAuth } from '../Context'
import PhoneModal from '../components/PhoneModal'

const Home = () => {
    const { signOut, userData } = useAuth()
    const [hasPhone, setHasPhone] = useState(false)
    const { user_metadata } = userData

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
                <Button onClick={() => signOut()}>Log Out</Button>
            </Stack>
        </CommonLayout>
    )
}

export default Home
