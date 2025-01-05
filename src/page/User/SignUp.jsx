import { useState } from "react"
import { Stepper, Button, Stack, TextInput, PasswordInput, PinInput, Space, Anchor } from '@mantine/core'
import PhoneInput from 'react-phone-input-2'
import { notifications } from '@mantine/notifications'

import { supabase } from "../../supabase"
import CommonLayout from "../../components/CommonLayout"

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOTP] = useState('')
    const [active, setActive] = useState(0)
    const [highestStepVisited, setHighestStepVisited] = useState(false)

    const handleStepChange = (step) => {
        setHighestStepVisited(false)

        let trimPassword = password.trim()

        if (active === 0 && step === 1) {
            if (!name.trim() || !email.trim() || !password.trim()) {
                notifications.show({
                    title: 'Step Error',
                    message: 'All fields are required in this step',
                    className: 'w-5/6 ml-auto',
                    position: 'top-right',
                    color: 'red',
                })
                return
            }
        }

        if (trimPassword.length < 8 && step == 1) {
            notifications.show({
                title: 'Registration Error',
                message: 'Password must have at least 8 characters',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }

        if (step == 3) {
            setHighestStepVisited(true)
            return
        }

        setActive(step)

    }

    const handleStepBack = (step) => {
        if (step == 0) {
            return
        }

        setActive(step - 1)
    }

    const shouldAllowSelectStep = (step) => highestStepVisited >= step && active !== step

    const handleGetOTP = async () => {

        let trimPhone = phone.trim()

        if (!trimPhone) {
            notifications.show({
                title: 'Step Error',
                message: 'Phone number is required',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red',
            })
        }

        const { data, error } = await supabase.auth.signInWithOtp({
            phone: `+${trimPhone}`,
        })

        if (error) {
            notifications.show({
                title: 'OTP Error',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red',
            })
            return
        }

        handleStepChange(active + 1)
    }

    const handleSignUp = async () => {

        let trimName = name.trim()
        let trimEmail = email.trim()
        let trimPassword = password.trim()
        let trimPhone = phone.trim()
        let trimOtp = otp.trim()

        if (!trimName || !trimEmail || !trimPassword || !trimPhone || !trimOtp) {
            notifications.show({
                title: 'Registration Error',
                message: 'All fields are required',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }

        const { otpData, otpError } = await supabase.auth.verifyOtp({
            phone: trimPhone,
            token: trimOtp,
            type: 'sms'
        })

        if (otpError) {
            notifications.show({
                title: 'OTP Verification Error',
                message: otpError.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })

            return
        }

        const { data, error } = await supabase.auth.updateUser({
            email: trimEmail,
            password: trimPassword,
            attributes: {
                data: {
                    trimName
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
                <Stack className="w-full">
                    <p className="font-bold text-3xl mb-5">Sign Up</p>
                    <Stepper size="sm" active={active} onStepClick={setActive}
                        styles={() => ({
                            step: {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                            stepBody: {
                                margin: '8px 0 0',
                            },
                            stepLabel: {
                                textAlign: 'center',
                            },
                            stepDescription: {
                                textAlign: 'center',
                            },
                            content: {
                                width: '90%',
                                placeSelf: 'center',
                                marginTop: '15px',
                            }
                        })}
                    >
                        <Stepper.Step
                            label="First Step"
                            description="Sign Up"
                            allowStepSelect={shouldAllowSelectStep(1)}
                        >
                            <Stack gap="xs">
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
                                <Button className='w-full' onClick={() => { handleStepChange(active + 1) }}>Sign Up</Button>
                            </Stack>
                        </Stepper.Step>
                        <Stepper.Step
                            label="Second Step"
                            description="Verify Phone"
                            allowStepSelect={shouldAllowSelectStep(1)}
                        >
                            <Stack gap="xs">
                                <PhoneInput
                                    country={'my'}
                                    value={phone}
                                    onChange={(phone) => setPhone(phone)}
                                />

                                <Space h="md" />
                                <Button className='w-full' disabled={phone.trim() ? false : true} onClick={() => { handleGetOTP() }}>Get OTP</Button>
                                {
                                    active != 0
                                    && <Button className='w-full' variant="default" onClick={() => handleStepBack(active)}>
                                        Back
                                    </Button>
                                }
                            </Stack>
                        </Stepper.Step>
                        <Stepper.Step
                            label="Third Step"
                            description="Verify OTP"
                            allowStepSelect={shouldAllowSelectStep(2)}
                        >
                            <Stack>
                                <PinInput
                                    oneTimeCode={true}
                                    size="xl"
                                    onChange={(value) => setOTP(value)}
                                    styles={() => ({
                                        root: {
                                            justifyContent: 'space-around',
                                        }
                                    })}
                                />

                                <Space h="md" />
                                <Button className='w-full' disabled={otp.trim() ? false : true} onClick={() => { handleSignUp() }}>Verify and Sign Up</Button>
                                {
                                    active != 0
                                    && <Button className='w-full' variant="default" onClick={() => handleStepBack(active)}>
                                        Back
                                    </Button>
                                }
                            </Stack>
                        </Stepper.Step>
                    </Stepper>
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
