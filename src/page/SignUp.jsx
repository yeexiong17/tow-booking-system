import { useEffect, useState } from "react"
import { Button, Stack, TextInput, PasswordInput, Space, Anchor, Flex, Divider } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { supabase } from "../supabase"
import CommonLayout from "../components/CommonLayout"

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')

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
                    role: role,
                    email: trimEmail
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
                    <div className="flex items-center w-full shadow relative">
                        <div
                            className={`absolute bg-blue-400 transition-all duration-300 rounded-md h-full ${role === 'user' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
                                }`}
                        ></div>
                        <Button
                            color="transparent"
                            className={`flex-1 py-1 text-center hover:cursor-pointer relative z-10`}
                            onClick={() => setRole('user')}
                            styles={() => ({
                                root: {
                                    color: role === 'user' ? 'white' : 'black'
                                }
                            })}
                        >
                            User
                        </Button>
                        <Button
                            color="transparent"
                            className={`flex-1 py-1 text-center hover:cursor-pointer relative z-10`}
                            onClick={() => setRole('tow')}
                            styles={() => ({
                                root: {
                                    color: role === 'tow' ? 'white' : 'black'
                                }
                            })}
                        >
                            Tow Driver
                        </Button>
                    </div>

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
