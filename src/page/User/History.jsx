import { Badge, Button, Card, Divider, Drawer, Flex, Group, Image, ScrollArea, Space, Stack, Text } from '@mantine/core'
import CommonLayout from '../../components/CommonLayout'
import { Link, useNavigate } from 'react-router-dom'
import { IconArrowNarrowRight, IconMapPin, IconMapPinFilled } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'

const History = () => {

    const [opened, { open, close }] = useDisclosure(false)
    const navigate = useNavigate()

    const allBadge = {
        "Pending": <Badge size='sm' color="blue">Pending</Badge>,
        "In progress": <Badge size='sm' color="yellow">In progress</Badge>,
        "Completed": <Badge size='sm' color="green">Completed</Badge>,
        "Canceled": <Badge size='sm' color="red">Canceled</Badge>,
    }

    return (
        <CommonLayout>
            <Drawer position='bottom' size='100%' opened={opened} onClose={close} title="Booking Details"
                styles={() => ({
                    title: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }
                })}
            >
                <Card padding="md" radius="md" withBorder>
                    <Stack>
                        <Text size="sm" fw={500}>Status: <span className='font-normal'>{allBadge["Completed"]}</span></Text>
                        <Text size="sm" fw={500}>Created At: <span className='font-normal'>08/01/2025, 14:30:00</span></Text>
                        <Text size="sm" fw={500}>Completed At: <span className='font-normal'>08/01/2025, 15:00:00</span></Text>
                    </Stack>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Card.Section>
                        <Image
                            src="https://sharetribe.imgix.net/5c6aae77-8bfa-446f-98b8-3c28a36f52c6/5ef0bdef-60d9-4ffd-a1f9-8afb4f5e82d2?auto=format&fit=clip&h=2400&w=2400&s=c22bb5914b1cbdcfd07ecc08e3586bf6"
                            height={150}
                            fit="contain"
                        />
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700}>Vehicle Details:</Text>
                    </Group>

                    <Text size="sm" fw={500}>Type: <span className='font-normal'>Sedan</span></Text>
                    <Text size="sm" fw={500}>Model: <span className='font-normal'>Toyota Vios</span></Text>
                    <Text size="sm" fw={500}>Color: <span className='font-normal'>White</span></Text>
                    <Text size="sm" fw={500}>Plate: <span className='font-normal'>ABC1234</span></Text>
                </Card>
                <Stack gap='xs' className='mt-4'>
                    <div className='flex flex-col'>
                        <Flex>
                            <IconMapPinFilled className='text-blue-500 mr-2' stroke={2} />
                            <Text className='flex items-center' fw={500}>
                                From
                            </Text>
                        </Flex>
                        <Flex>
                            <Space w="xl" />
                            <Text c='dimmed' size='sm'>
                                Persiaran Multimedia, 63100 Cyberjaya, Selangor
                            </Text>
                        </Flex>
                    </div>
                    <div>
                        <Flex>
                            <IconMapPinFilled className='text-red-500 mr-2' stroke={2} />
                            <Text className='flex items-center' fw={500}>
                                To
                            </Text>
                        </Flex>
                        <Flex>
                            <Space w="xl" />
                            <Text c='dimmed' size='sm'>
                                Jalan Ayer Keroh Lama, 75450 Bukit Beruang, Melaka
                            </Text>
                        </Flex>
                    </div>
                </Stack>

                <Button size='md' onClick={() => navigate('/feedback')} color="blue" fullWidth mt="md" radius="md">
                    Rate and Review
                </Button>
            </Drawer>
            <Stack>
                <p className="font-bold text-2xl text-neutral-800 mb-5">History</p>
                <ScrollArea className='h-full'>
                    <Card shadow="xs" padding="md" radius="md" withBorder
                        onClick={() => open()}
                        styles={() => ({
                            root: {
                                marginBottom: '10px',
                            }
                        })}
                    >
                        <Stack>
                            {
                                allBadge["Completed"]
                            }
                            <Flex>
                                <Text size='sm' lineClamp={2}>
                                    Persiaran Multimedia, 63100 Cyberjaya, Selangor to Jalan Ayer Keroh Lama, 75450 Bukit Beruang, Melaka
                                </Text>
                                <Space w="md" />
                                <Text className='text-nowrap'>RM 100</Text>
                            </Flex>
                            <Flex>
                                <Text size='sm' c='dimmed'>08/01/2025, 14:30:00</Text>
                                <Link
                                    className='flex items-center ml-auto text-blue-600'
                                >
                                    <Text size='sm' fw={500}>
                                        View Details
                                    </Text>
                                    <IconArrowNarrowRight stroke={2} />
                                </Link>
                            </Flex>
                        </Stack>
                    </Card>
                </ScrollArea>
            </Stack>

        </CommonLayout >
    )
}

export default History
