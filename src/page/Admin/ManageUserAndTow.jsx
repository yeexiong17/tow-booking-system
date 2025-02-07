import { useEffect, useState } from 'react'

import { IconPencil, IconTrash } from '@tabler/icons-react'
import { ActionIcon, Anchor, Avatar, Badge, Button, Card, Drawer, Flex, Group, Image, ScrollArea, Space, Stack, Table, Text } from '@mantine/core'
import CommonLayout from '../../components/CommonLayout'
import { useDisclosure } from '@mantine/hooks'
import { supabase } from '../../supabase'

const ManageUserAndTow = () => {

    const [opened, { open, close }] = useDisclosure(false)
    const [userData, setUserData] = useState([])
    const [towData, setTowData] = useState([])

    useEffect(() => {
        fetchUserData()
        fetchTowData()
    }, [])

    const fetchUserData = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('role', 'user')

            if (error) throw new Error(error)
            console.log(data)
            setUserData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTowData = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('role', 'tow')
                .neq('status', 'unverified')

            if (error) throw new Error(error)
            console.log(data)
            setTowData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const userRows = userData.map((item, index) => (
        <Table.Tr key={index}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={30} src={item.profile_picture} radius={30} />
                    <Text fz="sm" fw={500}>
                        {item.name}
                    </Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Anchor component="button" size="sm">
                    {item.email}
                </Anchor>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item?.phone || '-'}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <Button variant="default" onClick={open}>
                        View Details
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ))

    const towRows = towData.map((item, index) => (
        <Table.Tr key={index}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={30} src={item.profile_picture} radius={30} />
                    <Text fz="sm" fw={500}>
                        {item.name}
                    </Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Anchor component="button" size="sm">
                    {item.email}
                </Anchor>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item?.phone || '-'}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <Button variant="default" onClick={open}>
                        View Details
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <CommonLayout>
            <p className='font-bold text-2xl'>User</p>
            <ScrollArea type='always' h={320} className='px-2 mt-2'>
                <Table withTableBorder stickyHeader verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{userRows}</Table.Tbody>
                </Table>
            </ScrollArea>

            <Space h={50} />

            <p className='font-bold text-2xl'>Tow Driver</p>
            <ScrollArea type='always' h={320} className='px-2 mt-2'>
                <Table withTableBorder stickyHeader verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{towRows}</Table.Tbody>
                </Table>
            </ScrollArea>

            <Drawer position='right' offset={8} radius="md" opened={opened} onClose={close} title="Details"
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
                <ScrollArea className='h-full'>
                    <Stack className='h-full'>
                        <Card shadow="xs" padding="sm" radius="md" withBorder>
                            <p className='font-bold'>Personal Details</p>
                            <Space h="xs" />
                            <Flex className='items-center'>
                                <Avatar
                                    src={userData.face_photo_url}
                                    radius="lg"
                                    size="xl"
                                />
                                <Space w="md" />
                                <div className='py-4'>
                                    <Text><span className='font-bold'>Name: </span>Test 4</Text>
                                    <Text><span className='font-bold'>Email: </span>test4@gmail.com</Text>
                                    <Text><span className='font-bold'>Phone: </span>60123456789</Text>
                                </div>
                            </Flex>
                        </Card>
                        <Card shadow="xs" padding="sm" radius="md" withBorder>
                            <p className='font-bold'>Identification Details</p>
                            <Space h="xs" />
                            <Stack className='items-center'>
                                <Image
                                    radius="md"
                                    src="https://cdn-icons-png.flaticon.com/512/179/179573.png"
                                    styles={() => ({
                                        root: {
                                            aspectRatio: '3/2',
                                        }
                                    })}
                                />
                                <div>
                                    <Text><span className='font-bold'>Full Name: </span>John Doe</Text>
                                    <Text className='font-bold'><span className='font-bold'>Identification Number: </span>0401011473384</Text>
                                </div>
                            </Stack>
                        </Card>
                        <Card shadow="xs" padding="sm" radius="md" withBorder>
                            <p className='font-bold'>Driving License</p>
                            <Space h="xs" />
                            <Stack className='items-center'>
                                <Image
                                    radius="md"
                                    src="https://cdn-icons-png.flaticon.com/512/179/179573.png"
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
                                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                                    styles={() => ({
                                        root: {
                                            aspectRatio: '3/2',
                                        }
                                    })}
                                />
                                <div>
                                    <Text className='font-bold'><span className='font-bold'>Model: </span>Toyota Vios</Text>
                                    <Text><span className='font-bold'>Plate Number: </span>ABC1234</Text>
                                </div>
                            </Stack>
                        </Card>
                    </Stack>
                </ScrollArea>
            </Drawer>
        </CommonLayout>
    )
}

export default ManageUserAndTow