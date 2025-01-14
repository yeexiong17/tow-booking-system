import React from 'react'
import CommonLayout from '../../components/CommonLayout'
import { Button, FileInput, Space, Stack, TextInput } from '@mantine/core'
import { useAuth } from '../../Context'
import { useNavigate } from 'react-router-dom'

const NotVerified = () => {

    const { signOut } = useAuth()
    const navigate = useNavigate()

    const onSubmitForm = () => {
        navigate('/wait-verify')
    }

    return (
        <CommonLayout navShouldShow={false}>
            <Stack>
                <p className='font-bold'>Please enter your details for verification</p>
            </Stack>
            <Space h={10} />

            <TextInput
                label="Enter your name"
                description="Eg: John Doe"
                placeholder="Enter your full name"
            />
            <Space h={10} />

            <TextInput
                label="Vehicle Plate"
                description="Eg: ABC1234"
                placeholder="Enter your vehicle plate"
            />
            <Space h={10} />

            <TextInput
                label="Enter your vehicle model"
                description="Eg: Toyota Vios"
                placeholder="Enter your vehicle model"
            />
            <Space h={10} />

            <TextInput
                label="Enter your identification number"
                description="Eg: 040101148394"
                placeholder="Enter your identification number"
            />
            <Space h={10} />

            <FileInput
                label="Identification Card Photo"
                description="Upload a photo of your identification card"
                placeholder="Upload a photo..."
            />
            <Space h={10} />

            <FileInput
                label="License Card Photo"
                description="Upload a photo of your driving license"
                placeholder="Upload a photo..."
            />
            <Space h={10} />

            <FileInput
                label="Vehicle Photo"
                description="Upload a photo of your vehicle"
                placeholder="Upload a photo..."
            />

            <Button size='md' onClick={() => onSubmitForm()} color="green" fullWidth mt="md" radius="md">Submit For Review</Button>

            <Space h={20} />
            <Button size='md' onClick={() => signOut()} color="blue" fullWidth mt="md" radius="md">Log Out</Button>
        </CommonLayout>
    )
}

export default NotVerified
