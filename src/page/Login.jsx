import { useState } from "react"

import { Button, PasswordInput, Space, Stack, TextInput, Anchor } from "@mantine/core"
import CommonLayout from "../components/CommonLayout"
import { notifications } from "@mantine/notifications"

import { supabase } from "../supabase"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogIn = async () => {
        let trimEmail = email.trim()
        let trimPassword = password.trim()

        if (!trimEmail || !trimPassword) {
            notifications.show({
                title: 'Login Error',
                message: 'All fields are required',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            notifications.show({
                title: 'Login Error',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })

            return
        }
    }

    return (
        <CommonLayout>
            <Stack
                styles={() => ({
                    root: {
                        height: '100%',
                    }
                })}
            >
                <Stack>
                    <p className="font-bold text-3xl mb-5">Log In</p>
                    <TextInput
                        label="Email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(event) => setEmail(event.currentTarget.value)}
                    />

                    <PasswordInput
                        label="Password"
                        value={password}
                        placeholder="Create your password"
                        onChange={(event) => setPassword(event.currentTarget.value)}
                    />

                    <Space h="md" />
                    <Button className='w-full' onClick={() => { handleLogIn() }}>Log In</Button>
                </Stack>
                <p className="text-center mt-auto">
                    <Anchor href="/signup" underline="always">
                        New User? Click Here
                    </Anchor>
                </p>
            </Stack>
        </CommonLayout>
    )
}

export default Login
