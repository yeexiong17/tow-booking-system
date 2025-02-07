import { useEffect, useState } from 'react'

import {
    Stack,
    Group,
    ScrollArea,
    Table,
    Text,
    Flex,
    Button,
    Space,
    Avatar,
    Drawer,
    Card,
    Image,
    Modal,
    Textarea,
} from '@mantine/core'

import CommonLayout from '../../components/CommonLayout'
import { supabase } from '../../supabase'
import { useAuth } from '../../Context'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

const TowDriverApplication = () => {

    const [towDriverData, setTowDriverData] = useState([])
    const [opened, { open, close }] = useDisclosure(false)
    const [selectedTowDriver, setSelectedTowDriver] = useState(null)
    const [rejectModalOpened, setRejectModalOpened] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [approveModalOpened, setApproveModalOpened] = useState(false)

    const { toggle } = useAuth()

    useEffect(() => {
        getAllTow()
    }, [])

    const getAllTow = async () => {
        try {
            toggle()
            const { data, error } = await supabase.from('tow_driver_details').select().eq('status', 'pending')

            setTowDriverData(data)
        } catch (error) {

        } finally {
            toggle()
        }


    }

    const handleDrawerOpen = (id) => {
        const selectedTowDriver = towDriverData.find(item => item.id === id)
        setSelectedTowDriver(selectedTowDriver)

        open()
    }

    const handleApprove = async () => {
        try {
            toggle()
            console.log(selectedTowDriver)
            const { error: detailsError } = await supabase
                .from('tow_driver_details')
                .update({ status: 'approved' })
                .eq('id', selectedTowDriver.id)

            if (detailsError) throw detailsError

            // Create profile entry for the tow driver
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: selectedTowDriver.user_id,
                        email: selectedTowDriver.email,
                        name: selectedTowDriver.full_name,
                        phone: selectedTowDriver.phone,
                        role: 'tow',
                        status: 'active',
                        profile_picture: selectedTowDriver.face_photo_url
                    }
                ])

            if (profileError) throw profileError

            // Refresh the data and close drawer
            await getAllTow()
            close()
        } catch (error) {
            console.error('Error approving tow driver:', error)
        } finally {
            toggle()
        }
    }

    const handleReject = async () => {
        try {
            toggle()
            const { error } = await supabase
                .from('tow_driver_details')
                .update({
                    status: 'rejected',
                    reject_reason: rejectReason
                })
                .eq('user_id', selectedTowDriver.user_id)

            if (error) throw error

            notifications.show({
                title: 'Rejected Successfully',
                message: `${selectedTowDriver.full_name} application has been rejected`,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })

            setRejectReason('')
            setRejectModalOpened(false)
            await getAllTow()
            close()
        } catch (error) {
            console.error('Error rejecting tow driver:', error)
        } finally {
            toggle()
        }
    }

    const rows = towDriverData.map((item) => {
        return (
            <Table.Tr key={item.id} className='hover:bg-neutral-200 hover:cursor-pointer'>
                <Table.Td>
                    <Group gap="sm">
                        <Avatar size={26} src={item.face_photo_url} radius={26} />
                        <Text size="sm" fw={500}>
                            {item.full_name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>
                    <Button variant="default" onClick={() => handleDrawerOpen(item.id)}>
                        View Details
                    </Button>
                </Table.Td>
            </Table.Tr>
        )
    })

    return (
        <CommonLayout>
            <Drawer position='right' offset={8} radius="md" opened={opened} onClose={close} title="Tow Driver Application"
                styles={() => ({
                    title: {
                        fontWeight: 'bold'
                    },
                    body: {
                        height: '90%',
                        paddingBottom: 0,
                        overflow: 'hidden'
                    },
                    content: {
                        postition: 'relative'
                    }
                })}
            >
                <ScrollArea className='h-full pb-14'>
                    <Stack className='h-full'>
                        <Card shadow="xs" padding="sm" radius="md" withBorder>
                            <p className='font-bold'>Personal Details</p>
                            <Space h="xs" />
                            <Flex className='items-center'>
                                <Avatar
                                    src={selectedTowDriver?.face_photo_url}
                                    radius="lg"
                                    size="xl"
                                />
                                <Space w="md" />
                                <div className='py-4'>
                                    <Text><span className='font-bold'>Name: </span>{selectedTowDriver?.full_name}</Text>
                                    <Text><span className='font-bold'>Email: </span>{selectedTowDriver?.email}</Text>
                                    <Text><span className='font-bold'>Phone: </span>{selectedTowDriver?.phone}</Text>
                                </div>
                            </Flex>
                        </Card>
                        <Card shadow="xs" padding="sm" radius="md" withBorder>
                            <p className='font-bold'>Identification Details</p>
                            <Space h="xs" />
                            <Stack className='items-center'>
                                <Image
                                    radius="md"
                                    src={selectedTowDriver?.identification_card_photo_url}
                                    styles={() => ({
                                        root: {
                                            aspectRatio: '3/2',
                                        }
                                    })}
                                />
                                <div>
                                    <Text><span className='font-bold'>Full Name: </span>{selectedTowDriver?.full_name}</Text>
                                    <Text><span className='font-bold'>Identification Number: </span>{selectedTowDriver?.identification_number}</Text>
                                </div>
                            </Stack>
                        </Card>
                        <Card shadow="xs" padding="sm" radius="md" withBorder>
                            <p className='font-bold'>Driving License</p>
                            <Space h="xs" />
                            <Stack className='items-center'>
                                <Image
                                    radius="md"
                                    src={selectedTowDriver?.license_photo_url}
                                    styles={() => ({
                                        root: {
                                            aspectRatio: '3/2',
                                        }
                                    })}
                                />
                            </Stack>
                        </Card>
                        <Card shadow="xs" padding="sm" radius="md" withBorder>
                            <p className='font-bold'>Vehicle Details</p>
                            <Space h="xs" />
                            <Stack className='items-center'>
                                <Image
                                    radius="md"
                                    src={selectedTowDriver?.vehicle_photo_url}
                                    styles={() => ({
                                        root: {
                                            aspectRatio: '3/2',
                                        }
                                    })}
                                />
                                <div>
                                    <Text><span className='font-bold'>Model: </span>{selectedTowDriver?.vehicle_model}</Text>
                                    <Text><span className='font-bold'>Plate Number: </span>{selectedTowDriver?.vehicle_plate}</Text>
                                </div>
                            </Stack>
                        </Card>
                    </Stack>
                </ScrollArea>
                <Flex className='mt-auto' styles={() => ({
                    root: {
                        position: 'sticky',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2000,
                        backgroundColor: 'white',
                        borderTop: '1px solid #e9ecef'
                    }
                })}>
                    <Button
                        color='red'
                        className='grow'
                        size="md"
                        onClick={() => setRejectModalOpened(true)}
                        loading={false}
                    >
                        Reject
                    </Button>
                    <Space w="xs" />
                    <Button
                        className='grow'
                        size="md"
                        onClick={() => setApproveModalOpened(true)}
                        loading={false}
                    >
                        Approve
                    </Button>
                </Flex>
            </Drawer>

            <Modal
                opened={rejectModalOpened}
                onClose={() => setRejectModalOpened(false)}
                title="Reject Application"
                size="md"
            >
                <Stack>
                    <Textarea
                        label="Rejection Reason"
                        placeholder="Enter the reason for rejection"
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.currentTarget.value)}
                        minRows={3}
                        required
                    />
                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() => setRejectModalOpened(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            onClick={handleReject}
                            disabled={!rejectReason.trim()}
                        >
                            Reject
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal
                opened={approveModalOpened}
                onClose={() => setApproveModalOpened(false)}
                title="Approve Application"
                size="md"
            >
                <Stack>
                    <Text>Are you sure you want to approve {selectedTowDriver?.full_name}'s application?</Text>
                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() => setApproveModalOpened(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleApprove()
                                setApproveModalOpened(false)
                            }}
                        >
                            Approve
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Stack>
                <p className='font-bold text-2xl'>Tow Driver Application</p>
                <ScrollArea h={300}>
                    <Table miw={800} verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>User</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </ScrollArea>
            </Stack>
        </CommonLayout >
    )
}

export default TowDriverApplication
