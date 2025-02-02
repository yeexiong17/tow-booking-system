import {
    IconArrowDownRight,
    IconArrowUpRight,
    IconCarCrane,
    IconReceipt,
    IconUserPlus,
    IconUsersGroup,
} from '@tabler/icons-react'
import { Group, Paper, SimpleGrid, Text } from '@mantine/core'
import classes from '../../styles/Dashboard.module.css'
import CommonLayout from '../../components/CommonLayout'
import { LineChart } from '@mantine/charts'

const icons = {
    totalUser: IconUsersGroup,
    receipt: IconReceipt,
    tow: IconCarCrane,
    newUser: IconUserPlus,
}

const data = [
    { title: 'Total User', icon: 'totalUser', value: '13,456', diff: 34 },
    { title: 'Total Tow Driver', icon: 'tow', value: '4,145', diff: -13 },
    { title: 'Booking This Month', icon: 'receipt', value: '745', diff: 18 },
    { title: 'New User', icon: 'newUser', value: '188', diff: -30 },
]
const lineChartData = [
    {
        date: 'Mar 22',
        Booking: 10,
    },
    {
        date: 'Mar 23',
        Booking: 6,
    },
    {
        date: 'Mar 24',
        Booking: 5,
    },
    {
        date: 'Mar 25',
        Booking: 15,
    },
    {
        date: 'Mar 26',
        Booking: 20,
    },
]

const Dashboard = () => {
    const stats = data.map((stat) => {
        const Icon = icons[stat.icon]
        const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group justify="space-between">
                    <Text size="xs" c="dimmed" className={classes.title}>
                        {stat.title}
                    </Text>
                    <Icon className={classes.icon} size={22} stroke={1.5} />
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>
                    <Text c={stat.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
                        <span>{stat.diff}%</span>
                        <DiffIcon size={16} stroke={1.5} />
                    </Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    Compared to previous month
                </Text>
            </Paper>
        )
    })
    return (
        <CommonLayout>
            <p className='font-bold text-2xl'>Dashboard</p>

            <div className={classes.root}>
                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
            </div>
            <LineChart
                h={400}
                data={lineChartData}
                dataKey="date"
                withLegend
                legendProps={{ verticalAlign: 'bottom', height: 50 }}
                series={[
                    { name: 'Booking', color: 'indigo.6' },
                ]}
            />
        </CommonLayout>
    )
}

export default Dashboard