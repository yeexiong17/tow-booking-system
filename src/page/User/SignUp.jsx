import { useState } from "react"
import { Button, Stack, TextInput, PasswordInput, Space, Anchor } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { supabase } from "../../supabase"
import CommonLayout from "../../components/CommonLayout"

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = async () => {

        let trimName = name.trim()
        let trimEmail = email.trim()
        let trimPassword = password.trim()

        if (!trimName || !trimEmail || !trimPassword) {
            notifications.show({
                title: 'Registration Error',
                message: 'All fields are required',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email: trimEmail,
            password: trimPassword,
            options: {
                data: {
                    name: trimName,
                    role: 'user'
                }
            }
        })

        if (error) {
            notifications.show({
                title: 'Signup Error',
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
                <Stack gap="xs">
                    <p className="font-bold text-3xl mb-5">Sign Up</p>
                    <TextInput
                        label="Name"
                        value={name}
                        description="Example: John Doe"
                        placeholder="Enter your name"
                        onChange={(event) => setName(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        description="Example: user1@gmail.com"
                        placeholder="Enter your email"
                        onChange={(event) => setEmail(event.currentTarget.value)}
                    />

                    <PasswordInput
                        label="Password"
                        value={password}
                        description="Password must be at least 8 characters long | Example: Abc@1234"
                        placeholder="Create your password"
                        onChange={(event) => setPassword(event.currentTarget.value)}
                    />

                    <Space h="md" />
                    <Button className='w-full' onClick={() => { handleSignUp() }}>Sign Up</Button>
                </Stack>

                <p className="text-center mt-auto">
                    <Anchor href="/login" underline="always">
                        Have an Account? Click Here
                    </Anchor>
                </p>
            </Stack>
        </CommonLayout >
    )
}

export default SignUp
