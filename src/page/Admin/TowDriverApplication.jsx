import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import {
    Stack,
    Center,
    Group,
    keys,
    ScrollArea,
    Table,
    Text,
    TextInput,
    UnstyledButton,
    Flex,
    Button,
    Modal,
    Space,
    PasswordInput,
    Avatar,
    Drawer,
    Fieldset,
    Card,
    Image,
} from '@mantine/core'

import CommonLayout from '../../components/CommonLayout'
import { adminSupabase, supabase } from '../../supabase'
import { useAuth } from '../../Context'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { Container } from 'postcss'

const data = [
    {
        id: '1',
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
        name: 'Robert Wolfkisser',
        job: 'Engineer',
        email: 'rob_wolf@gmail.com',
    },
    {
        id: '2',
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
        name: 'Jill Jailbreaker',
        job: 'Engineer',
        email: 'jj@breaker.com',
    },
    {
        id: '3',
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
        name: 'Henry Silkeater',
        job: 'Designer',
        email: 'henry@silkeater.io',
    },
    {
        id: '4',
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
        name: 'Bill Horsefighter',
        job: 'Designer',
        email: 'bhorsefighter@gmail.com',
    },
    {
        id: '5',
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
        name: 'Jeremy Footviewer',
        job: 'Manager',
        email: 'jeremy@foot.dev',
    },
];

const TowDriverApplication = () => {

    const [search, setSearch] = useState('')
    const [towDriverData, setTowDriverData] = useState([])
    const [sortedData, setSortedData] = useState([])
    const [sortBy, setSortBy] = useState(null)
    const [reverseSortDirection, setReverseSortDirection] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    // Modal State
    const [opened, { open, close }] = useDisclosure(false)

    const { toggle } = useAuth()

    useEffect(() => {
        toggle()
        getAllTow()
        toggle()
    }, [])

    const getAllTow = async () => {
        const { data, error } = await supabase.from('tow_driver_details').select()
        console.log(data)
        // setTowDriverData(data)
        // setSortedData(data)
    }

    const handleNewTowDriver = async () => {

        let trimEmail = email.trim()
        let trimPassword = password.trim()
        let trimName = name.trim()

        toggle()
        const { data, error } = await adminSupabase.auth.admin.createUser({
            email: trimEmail,
            password: trimPassword,
            email_confirm: true,
            user_metadata: {
                name: trimName,
                role: 'admin',
                email
            },
        })
        toggle()

        if (error) {
            notifications.show({
                title: 'Failed To Create New Admin',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })

            return
        }

        notifications.show({
            title: 'Admin Created Successfully',
            className: 'w-5/6 ml-auto',
            position: 'top-right',
            color: 'green'
        })
    }

    const rows = data.map((item) => {
        return (
            <Table.Tr key={item.id} className='hover:bg-neutral-200 hover:cursor-pointer'>
                <Table.Td>
                    <Group gap="sm">
                        <Avatar size={26} src={item.avatar} radius={26} />
                        <Text size="sm" fw={500}>
                            {item.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{item.email}</Table.Td>
                <Table.Td>
                    <Button variant="default" onClick={open}>
                        View Details
                    </Button>
                </Table.Td>
            </Table.Tr>
        )
    })

    return (
        <CommonLayout>
            <Modal opened={undefined} onClose={close} title="New Admin">
                <TextInput
                    required
                    label="Name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(event) => setName(event.currentTarget.value)}
                    radius="md"
                />
                <Space h="md" />
                <TextInput
                    required
                    label="Email"
                    placeholder="hello@mantine.dev"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    radius="md"
                />
                <Space h="md" />
                <PasswordInput
                    required
                    label="Password"
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    radius="md"
                />
                <Space h="md" />
            </Modal>
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
                                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
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
                                    <Text className='font-bold'><span className='font-bold'>Model: </span>Toyota Vios</Text>
                                    <Text><span className='font-bold'>Plate Number: </span>ABC1234</Text>
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
                                <div>
                                    <Text className='font-bold'><span className='font-bold'>Model: </span>Toyota Vios</Text>
                                    <Text><span className='font-bold'>Plate Number: </span>ABC1234</Text>
                                </div>
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
                <Flex className='mt-auto' styles={() => ({
                    root: {
                        position: 'sticky',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2000
                    }
                })}>
                    <Button color='red' className='grow' size="md">Reject</Button>
                    <Space w="xs" />
                    <Button className='grow' size="md">Approve</Button>
                </Flex>
            </Drawer>

            <Stack>
                <p className='font-bold text-2xl'>Tow Driver Application</p>
                <ScrollArea h={300}>
                    <Table miw={800} verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>User</Table.Th>
                                <Table.Th>Email</Table.Th>
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
