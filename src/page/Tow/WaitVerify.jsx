import React from 'react'
import CommonLayout from '../../components/CommonLayout'
import { Button, Space } from '@mantine/core'
import { useAuth } from '../../Context'

const WaitVerify = () => {

    const { signOut } = useAuth()

    return (
        <CommonLayout navShouldShow={false}>
            <p className='font-bold text-xl'>You have submitted your application</p>
            <Space h={20} />
            <p className='text-red-500'>You will not be able to use the app until admin verified your details</p>

            <Space h={20} />
            <Button size='md' onClick={() => signOut()} color="red" fullWidth mt="md" radius="md">Log Out</Button>

        </CommonLayout>
    )
}

export default WaitVerify
