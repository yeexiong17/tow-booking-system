import { useEffect, useState } from "react"

import PhoneInput from 'react-phone-input-2'
import { Button, Modal, PinInput, Stack, Tabs, Transition } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"

import { useAuth } from '../Context'
import { supabase } from "../supabase"

const PhoneModal = ({ hasPhone }) => {
    const [opened, { open, close }] = useDisclosure(false)

    const [activeTab, setActiveTab] = useState('first')
    const { userData } = useAuth()

    const [phone, setPhone] = useState('')
    const [otp, setOTP] = useState('')

    const [transOpen, setTransOpen] = useState(false)

    useEffect(() => {
        if (!hasPhone) {
            open()
        }
    }, [hasPhone])

    const handleGetOTP = async () => {
        let trimPhone = phone.trim()

        if (!trimPhone) {
            notifications.show({
                title: 'Input Error',
                message: 'Please enter your phone number',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })

            return
        }

        // const { error } = await supabase.auth.updateUser({
        //     phone: trimPhone
        // })

        // if (error) {
        //     notifications.show({
        //         title: 'OTP Request Error',
        //         message: error.message,
        //         className: 'w-5/6 ml-auto',
        //         position: 'top-right',
        //         color: 'red'
        //     })

        //     return
        // }

        notifications.show({
            title: 'OTP Sent',
            message: 'Please check your phone for OTP code',
            className: 'w-5/6 ml-auto',
            position: 'top-right',
            color: 'green'
        })

        setActiveTab('second')
        setTransOpen(true)
    }

    const handleVerifyOTP = async () => {
        let trimPhone = phone.trim()
        console.log(trimPhone)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ phone: trimPhone })
                .eq('id', userData.id)

            if (!error) {
                notifications.show({
                    title: 'Phone Number Updated',
                    message: 'Phone number updated successfully',
                    className: 'w-5/6 ml-auto',
                    position: 'top-right',
                    color: 'green'
                })
            }
        } catch (error) {
            notifications.show({
                title: 'Phone Number Update Error',
                message: 'Failed to update phone number',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
        }
        finally {
            close()
        }
    }

    return (
        <Modal opened={opened} onClose={close} title="Verify Phone" centered closeOnClickOutside={false} closeOnEscape={false}>
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.Panel value="first">
                    <Stack>
                        <PhoneInput
                            country={'my'}
                            value={phone}
                            onChange={(phone) => setPhone(phone)}
                        />

                        <Button onClick={() => handleGetOTP()}>Get OTP</Button>
                    </Stack>
                </Tabs.Panel>
                <Transition
                    mounted={transOpen}
                    transition="slide-left"
                >
                    {(transitionStyle) =>
                        <Tabs.Panel
                            style={transitionStyle}
                            value="second">
                            <Stack>
                                <PinInput
                                    oneTimeCode={true}
                                    onChange={(value) => setOTP(value)}
                                    styles={() => ({
                                        root: {
                                            justifyContent: 'space-around',
                                        }
                                    })}
                                />

                                <Button onClick={() => handleVerifyOTP()}>Verify OTP</Button>
                            </Stack>
                        </Tabs.Panel>
                    }
                </Transition>
            </Tabs>
        </Modal>
    )
}

export default PhoneModal
