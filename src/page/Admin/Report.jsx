import { useState } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { DatePickerInput } from '@mantine/dates'
import { Button, Flex, Space } from '@mantine/core'
import { ScrollArea, Table } from '@mantine/core'
import classes from '../../styles/ReportTable.module.css'


const data = [
    {
        id: 1,
        date: '22/03/2025',
    },
    {
        id: 2,
        date: '10/01/2025',
    },
    {
        id: 3,
        date: '17/01/2025',
    }
]

const Report = () => {

    const [value, setValue] = useState(null)
    const [scrolled, setScrolled] = useState(false)

    const rows = data.map((row) => (
        <Table.Tr key={row.name}>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.date}</Table.Td>
            <Table.Td>
                <Button>Generate Report</Button>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <CommonLayout>
            <p className='font-bold text-2xl'>Report</p>

            <Space h={20} />
            <div className='w-2/6'>
                <DatePickerInput
                    label="Pick date"
                    placeholder="Pick date"
                    value={value}
                    onChange={setValue}
                />
            </div>

            <Space h={20} />
            <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <Table miw={700}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>No.</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ScrollArea>
        </CommonLayout>

    )
}

export default Report