import { useRef } from "react"
import PhoneInput from 'react-phone-input-2'
import { Button, Container, Input, PasswordInput, Space, TextInput } from "@mantine/core"
import { notifications } from '@mantine/notifications'

import { supabase } from "../../supabase"

const SignUp = () => {

    const emailRef = useRef('')
    const nameRef = useRef('')
    const passwordRef = useRef('')
    const confirmPasswordRef = useRef('')
    const phoneRef = useRef('')

    const handleSignUp = async () => {

        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            notifications.show({
                title: 'Registration Error',
                message: 'All fields are required',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }

        let name = nameRef.current.trim()
        let email = emailRef.current.trim()
        let password = passwordRef.current.trim()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        })

        if (error) {
            notifications.show({
                title: 'Registration Error',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
        }
    }

    return (
        <Container className="w-full mt-5">
            <TextInput
                label="Name"
                description="Example: John Doe"
                placeholder="Enter your name"
                onChange={(event) => nameRef.current = event.currentTarget.value}
            />

            <Space h="md" />
            <TextInput
                label="Email"
                description="Example: user1@gmail.com"
                placeholder="Enter your email"
                onChange={(event) => emailRef.current = event.currentTarget.value}
            />

            <Space h="md" />
            <Input.Wrapper label="Phone Number" description="Input description">
                <PhoneInput
                    className="h-8 mt-2"
                    inputStyle={{ width: '100%', height: '100%' }}
                    country={'my'}
                    onChange={(event) => phoneRef.current = event}
                />
            </Input.Wrapper >

            <Space h="md" />
            <PasswordInput
                label="Password"
                description="Password must be at least 8 characters long | Example: Abc@1234"
                placeholder="Create your password"
                onChange={(event) => passwordRef.current = event.currentTarget.value}
            />

            <Space h="md" />
            <PasswordInput
                label="Confirm Password"
                description="Both password and confirmation password must be the same"
                placeholder="Confirm your password"
                onChange={(event) => confirmPasswordRef.current = event.currentTarget.value}
            />

            <Space h="md" />
            <Button onClick={handleSignUp} variant="filled" fullWidth radius="md">Sign Up</Button>
        </Container>
    )
}

export default SignUp
