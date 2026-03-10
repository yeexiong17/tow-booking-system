import { useEffect, useState } from 'react'
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react'
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
} from '@mantine/core'

import CommonLayout from '../../components/CommonLayout'
import classes from '../../styles/AdminSortTable.module.css'
import { adminSupabase, supabase } from '../../supabase'
import { useAuth } from '../../Context'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { convertToMalaysiaTime } from '../../helpers/HelperFunction'

const Th = ({ children, reversed, sorted, onSort }) => {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={16} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    )
}

// 3
const filterData = (data, search) => {
    const query = search.toLowerCase().trim()
    return data.filter((item) =>
        keys(data[0]).some((key) => {
            const value = item[key]
            return typeof value === 'string' && value.toLowerCase().includes(query)
        })
    )
}

// 2
const sortData = (data, payload) => {
    const { sortBy } = payload

    if (!sortBy) {
        return filterData(data, payload.search)
    }

    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                return b[sortBy].localeCompare(a[sortBy])
            }

            return a[sortBy].localeCompare(b[sortBy])
        }),
        payload.search
    )
}

const ManageAdmin = () => {

    const [search, setSearch] = useState('')
    const [adminData, setAdminData] = useState([])
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
        getAllAdmin()
        toggle()
    }, [toggle])

    const getAllAdmin = async () => {
        const { data, error } = await supabase.from('profiles').select().eq('role', 'admin')
        if (error) {
            notifications.show({
                title: 'Failed To Fetch Admins',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }
        setAdminData(data)
        setSortedData(data)
    }

    // 1
    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false
        setReverseSortDirection(reversed)
        setSortBy(field)
        setSortedData(sortData(adminData, { sortBy: field, reversed, search }))
    }

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget
        setSearch(value)
        setSortedData(sortData(adminData, { sortBy, reversed: reverseSortDirection, search: value }))
    }

    const rows = sortedData.map((row) => (
        <Table.Tr key={row.name} >
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.email}</Table.Td>
            <Table.Td>{row.status}</Table.Td>
            <Table.Td>{convertToMalaysiaTime(row.created_at)}</Table.Td>
        </Table.Tr>
    ))

    const handleNewAdmin = async () => {

        let trimEmail = email.trim()
        let trimPassword = password.trim()
        let trimName = name.trim()

        toggle()
        const { error } = await adminSupabase.auth.admin.createUser({
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

    return (
        <CommonLayout>
            <Modal opened={opened} onClose={close} title="New Admin">
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
                <Button onClick={() => handleNewAdmin()}>Create Admin</Button>
            </Modal>
            <Stack>
                <p className='font-bold text-2xl'>Manage Admin</p>
                <Flex>
                    <TextInput
                        className='grow mr-5'
                        placeholder="Search by any field"
                        mb="md"
                        leftSection={<IconSearch size={16} stroke={1.5} />}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <Button
                        onClick={() => open()}
                    >
                        Create Admin
                    </Button>
                </Flex>
                <ScrollArea h={300} type='always'>
                    <Table stickyHeader horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                        <Table.Thead>
                            <Table.Tr>
                                <Th
                                    sorted={sortBy === 'name'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('name')}
                                >
                                    Name
                                </Th>
                                <Th
                                    sorted={sortBy === 'email'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('email')}
                                >
                                    Email
                                </Th>
                                <Th
                                    sorted={sortBy === 'status'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('status')}
                                >
                                    Status
                                </Th>
                                <Table.Th className={classes.th}>
                                    <UnstyledButton className={classes.control}>
                                        <Group justify="space-between">
                                            <Text fw={500} fz="sm">Date Created</Text>
                                        </Group>
                                    </UnstyledButton>
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.length > 0 ? (
                                rows
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={3}>
                                        <Text fw={500} ta="center">
                                            Nothing found
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Stack>
        </CommonLayout>
    )
}

export default ManageAdmin
