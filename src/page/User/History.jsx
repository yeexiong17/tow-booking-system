import { useState, useEffect } from 'react'
import { Badge, Card, Drawer, Flex, Group, Image, ScrollArea, Space, Stack, Text, Button } from '@mantine/core'
import CommonLayout from '../../components/CommonLayout'
import { Link } from 'react-router-dom'
import { IconArrowNarrowRight, IconMapPinFilled } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import Map from '../../components/Map'
import { supabase } from '../../supabase'
import { useAuth } from '../../Context'
import { convertToMalaysiaTime } from '../../helpers/HelperFunction'

const History = () => {

    const [opened, { open, close }] = useDisclosure(false)
    const [bookingData, setBookingData] = useState([])
    const { userData, liveLocation } = useAuth()
    const [selectedData, setSelectedData] = useState([])
    const [towLiveLocation, setTowLiveLocation] = useState({ latitude: 0, longitude: 0 })

    const allBadge = {
        "Pending": <Badge size='sm' color="blue">Pending</Badge>,
        "In progress": <Badge size='sm' color="yellow">In progress</Badge>,
        "Completed": <Badge size='sm' color="green">Completed</Badge>,
        "Canceled": <Badge size='sm' color="red">Canceled</Badge>,
    }

    useEffect(() => {
        fetchBookingData()
    }, [])

    useEffect(() => {
        if (selectedData.length === 0) return

        const interval = setInterval(getTowLocation, 2000)

        return () => clearInterval(interval)
    }, [selectedData])

    const getTowLocation = async () => {
        const filteredData = bookingData.filter(item => item.status === "In progress")
        console.log('getting tow location...')
        if (filteredData.length > 0) {
            const { data, error } = await supabase
                .from('locations')
                .select()
                .eq('user_id', filteredData[0].tow_id)

            console.log(data[0].latitude, data[0].longitude)
            if (data && data.length > 0) {
                setTowLiveLocation({ latitude: data[0].latitude, longitude: data[0].longitude })
            }
        }
    }

    const fetchBookingData = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select()
                .eq('user_id', userData.id)
                .order('created_at', { ascending: false })

            if (error) throw new Error(error)
            const sortedData = data.sort((a, b) => {
                const statusOrder = { "Pending": 1, "In progress": 2, "Completed": 3, "Canceled": 4 }

                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status]
                }
                return new Date(b.created_at) - new Date(a.created_at)
            })

            setBookingData(sortedData)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDrawerOpen = (index) => {
        const data = bookingData[index]

        setSelectedData(data)
        open()
    }

    const handleDrawerClose = () => {
        setSelectedData([])
        close()
    }

    return (
        <CommonLayout>
            <Drawer position='bottom' size='100%' opened={opened} onClose={() => handleDrawerClose()} title="Booking Details"
                styles={() => ({
                    title: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }
                })}
            >
                <Card padding="md" radius="md" withBorder>
                    <Stack>
                        <Flex align="center" gap="xs">
                            <Text size="sm" fw={500}>Status:</Text>
                            {allBadge[selectedData.status]}
                        </Flex>
                        <Text size="sm" fw={500}>Created At: <span className='font-normal'>{convertToMalaysiaTime(selectedData.created_at)}</span></Text>
                        <Text size="sm" fw={500}>Completed At: <span className='font-normal'>{selectedData.completed_at ? convertToMalaysiaTime(selectedData.completed_at) : '-'}</span></Text>
                    </Stack>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Card.Section>
                        <Image
                            src={selectedData.vehicle_image_url}
                            height={150}
                            fit="contain"
                        />
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700}>Vehicle Details:</Text>
                    </Group>

                    <Text size="sm" fw={500}>Type: <span className='font-normal'>{selectedData.vehicle_type}</span></Text>
                    <Text size="sm" fw={500}>Model: <span className='font-normal'>{selectedData.vehicle_model}</span></Text>
                    <Text size="sm" fw={500}>Color: <span className='font-normal'>{selectedData.vehicle_color}</span></Text>
                    <Text size="sm" fw={500}>Plate: <span className='font-normal'>{selectedData.vehicle_plate}</span></Text>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Stack gap='xs' className='mt-4'>
                        <Stack>
                            <Flex>
                                <IconMapPinFilled className='text-blue-500 mr-2' stroke={2} />
                                <Text className='flex items-center' fw={500}>
                                    From
                                </Text>
                            </Flex>
                            <Flex>
                                <Space w="xl" />
                                <Text c='dimmed' size='sm'>
                                    {selectedData.from_location}
                                </Text>
                            </Flex>
                        </Stack>
                        <Stack>
                            <Flex>
                                <IconMapPinFilled className='text-red-500 mr-2' stroke={2} />
                                <Text className='flex items-center' fw={500}>
                                    To
                                </Text>
                            </Flex>
                            <Flex>
                                <Space w="xl" />
                                <Text c='dimmed' size='sm'>
                                    {selectedData.to_location}
                                </Text>
                            </Flex>
                        </Stack>

                        <Map bookingLocation={[selectedData.from_coordinates, towLiveLocation]} center={liveLocation} />
                    </Stack>
                </Card>

                <Space h="lg" />
                {selectedData.status === 'Completed' && (
                    <Link
                        to={`/feedback?userId=${userData.id}&bookingId=${selectedData.id}`}
                    >
                        <Button size='md' color="blue" fullWidth mt="md" radius="md">
                            Leave Feedback
                        </Button>
                    </Link>
                )}
            </Drawer>
            <Stack>
                <Text className="font-bold text-2xl text-neutral-800 mb-5">History</Text>
                <ScrollArea className='h-full'>
                    {
                        bookingData.length > 0
                            ? bookingData.map((booking, index) => (
                                <Card key={index} shadow="xs" padding="md" radius="md" withBorder
                                    onClick={() => handleDrawerOpen(index)}
                                    styles={() => ({
                                        root: {
                                            marginBottom: '10px',
                                        }
                                    })}
                                >
                                    <Stack>
                                        {
                                            allBadge[booking.status]
                                        }
                                        <Flex>
                                            <Text size='sm' lineClamp={2}>
                                                {booking.from_location} to {booking.to_location}
                                            </Text>
                                            <Space w="md" />
                                            <Text className='text-nowrap'>RM {booking.price || 'N/A'}</Text>
                                        </Flex>
                                        <Flex>
                                            <Text size='sm' c='dimmed'>{convertToMalaysiaTime(booking.created_at)}</Text>
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
                            ))
                            : <Text size="sm" c="dimmed">No booking history available.</Text>
                    }

                </ScrollArea>
            </Stack>
        </CommonLayout>
    )
}

export default History
