import React from 'react'
import { Button, PasswordInput, Space, Stack, Text } from '@mantine/core'

import CommonLayout from '../components/CommonLayout'

const AdminSetting = () => {
    return (
        <CommonLayout>
            <Stack>
                <p className='font-bold text-2xl'>Setting</p>

                <Stack className='w-2/5'>
                    <PasswordInput
                        label="Old Password"
                        placeholder="Enter your old password"
                    />
                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                    />
                    <PasswordInput
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
                    />
                    <Space h={10} />
                    <Button>Change Password</Button>
                </Stack>
            </Stack>
        </CommonLayout>
    )
}

export default AdminSetting
