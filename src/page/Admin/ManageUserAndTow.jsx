import { IconPencil, IconTrash } from '@tabler/icons-react'
import { ActionIcon, Anchor, Avatar, Badge, Button, Card, Drawer, Flex, Group, Image, ScrollArea, Space, Stack, Table, Text } from '@mantine/core'
import CommonLayout from '../../components/CommonLayout'
import { useDisclosure } from '@mantine/hooks'

const userData = [
    {
        avatar:
            'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png',
        name: 'Robert Wong',
        email: 'robert@gmail.com',
        phone: '+60134529811',
    },
    {
        avatar:
            'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png',
        name: 'Kathy',
        email: 'kathy@gmail.com',
        phone: '+60124523167',
    },
    {
        avatar:
            'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png',
        name: 'Henry',
        email: 'henry@gmail.com',
        phone: '+60124513311',
    },
]

const towData = [
    {
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
        name: 'Walton Hopkins',
        email: 'walton@gmail.com',
        phone: '+60125685492',
    },
    {
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
        name: 'Dustin Duke',
        email: 'dustin@gmail.com',
        phone: '+60117654291',
    },
    {
        avatar:
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
        name: 'Janis Hanna',
        email: 'janie@gmail.com',
        phone: '+60125628496',
    },
]

const ManageUserAndTow = () => {

    const [opened, { open, close }] = useDisclosure(false)


    const userRows = userData.map((item) => (
        <Table.Tr key={item.name}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={30} src={item.avatar} radius={30} />
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
                <Text fz="sm">{item.phone}</Text>
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

    const towRows = towData.map((item) => (
        <Table.Tr key={item.name}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={30} src={item.avatar} radius={30} />
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
                <Text fz="sm">{item.phone}</Text>
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

            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>User</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{userRows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <Space h={20} />
            <p className='font-bold text-2xl'>Tow Driver</p>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Tow Driver</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{towRows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>

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