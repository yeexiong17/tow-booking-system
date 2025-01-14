import { useState } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { DatePickerInput } from '@mantine/dates'
import { Button, Flex, Space } from '@mantine/core'
import { ScrollArea, Table } from '@mantine/core'
import classes from '../../styles/ReportTable.module.css'


const data = [
    {
        name: 'Athena Weissnat',
        company: 'Little - Rippin',
        email: 'Elouise.Prohaska@yahoo.com',
    },
    {
        name: 'Deangelo Runolfsson',
        company: 'Greenfelder - Krajcik',
        email: 'Kadin_Trantow87@yahoo.com',
    },
    {
        name: 'Danny Carter',
        company: 'Kohler and Sons',
        email: 'Marina3@hotmail.com',
    },
    {
        name: 'Trace Tremblay PhD',
        company: 'Crona, Aufderhar and Senger',
        email: 'Antonina.Pouros@yahoo.com',
    },
]

const Report = () => {

    const [value, setValue] = useState(null)

    const [scrolled, setScrolled] = useState(false);

    const rows = data.map((row) => (
        <Table.Tr key={row.name}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.email}</Table.Td>
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
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Email</Table.Th>
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