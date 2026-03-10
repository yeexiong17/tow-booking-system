import { useState, useEffect, useCallback } from 'react'
import { Badge, Card, Drawer, Flex, Group, Image, ScrollArea, Space, Stack, Text, Button, Avatar, Divider } from '@mantine/core'
import CommonLayout from '../../components/CommonLayout'
import { Link } from 'react-router-dom'
import { IconArrowNarrowRight, IconMapPinFilled } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import Map from '../../components/Map'
import { supabase } from '../../supabase'
import { useAuth } from '../../Context'
import { convertToMalaysiaTime } from '../../helpers/HelperFunction'
import { useNavigate } from 'react-router-dom'

const History = ({ autoOpenInProgress = false }) => {

    const [opened, { open, close }] = useDisclosure(false)
    const [bookingData, setBookingData] = useState([])
    const { userData, liveLocation } = useAuth()
    const [selectedData, setSelectedData] = useState([])
    const [towDriverData, setTowDriverData] = useState([])
    const [towLiveLocation, setTowLiveLocation] = useState({ latitude: 0, longitude: 0 })
    const navigate = useNavigate()

    const allBadge = {
        "Pending": <Badge size='sm' color="blue">Pending</Badge>,
        "In progress": <Badge size='sm' color="yellow">In progress</Badge>,
        "Completed": <Badge size='sm' color="green">Completed</Badge>,
        "Canceled": <Badge size='sm' color="red">Canceled</Badge>,
        "Unpaid": <Badge size='sm' color="orange">Unpaid</Badge>,
    }

    const getTowLocation = useCallback(async () => {
        const filteredData = bookingData.filter(item => item.status === "In progress")
        if (filteredData.length !== 0) {
            console.log('getting tow location...')
            const { data, error } = await supabase
                .from('locations')
                .select()
                .eq('user_id', filteredData[0].tow_id)

            if (error) {
                console.error(error)
                return
            }

            if (data && data.length > 0) {
                console.log(data[0].latitude, data[0].longitude)
                setTowLiveLocation({ latitude: data[0].latitude, longitude: data[0].longitude })
            }
        }
    }, [bookingData])

    const getTowDriverData = useCallback(async (towID) => {
        const { data, error } = await supabase
            .from('tow_driver_details')
            .select('*')
            .eq('user_id', towID)

        if (error) {
            console.error(error)
            return
        }

        setTowDriverData(data[0])
    }, [])

    const fetchBookingData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select()
                .eq('user_id', userData.id)
                .order('created_at', { ascending: false })

            if (error) throw new Error(error)
            const sortedData = data.sort((a, b) => {
                const statusOrder = { "Pending": 1, "In progress": 2, "Unpaid": 3, "Completed": 4, "Canceled": 5 }

                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status]
                }
                return new Date(b.created_at) - new Date(a.created_at)
            })

            setBookingData(sortedData)
            if (autoOpenInProgress) {
                const inProgressBooking = sortedData.find(b => b.status === "In progress")
                if (inProgressBooking) {
                    getTowDriverData(inProgressBooking.tow_id)
                    setSelectedData(inProgressBooking)
                    open()
                }
            }
        } catch (error) {
            console.log(error)
        }
    }, [userData.id, autoOpenInProgress, getTowDriverData, open])

    useEffect(() => {
        fetchBookingData()
    }, [fetchBookingData])

    useEffect(() => {
        if (selectedData.length === 0) return

        const interval = setInterval(getTowLocation, 2000)

        return () => clearInterval(interval)
    }, [selectedData, getTowLocation])

    const handleDrawerOpen = (index) => {
        const data = bookingData[index]

        setSelectedData(data)
        getTowDriverData(data.tow_id)
        open()
    }

    const handleDrawerClose = () => {
        if (autoOpenInProgress) {
            navigate('/home')
        } else {
            setSelectedData([])
            close()
        }
    }
    const handleCancelBooking = async () => {
        try {
            if (!selectedData.id || selectedData.status !== 'In progress') return

            // Update the booking status to "Completed"
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({ status: 'Canceled', completed_at: new Date().toISOString() })
                .eq('id', selectedData.id)

            if (bookingError) throw bookingError

            // Update the driver's status in the profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ status: 'active' })
                .eq('id', selectedData.tow_id)

            if (profileError) throw profileError

            // Update the state to reflect the changes
            setBookingData((prevBookings) =>
                prevBookings.map((b) =>
                    b.id === selectedData.id ? { ...b, status: 'Canceled', completed_at: null } : b
                )
            )

            // Close the drawer
            close()
        } catch (error) {
            console.error("Error updating booking and profile:", error)
        }
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

                {towDriverData && (selectedData.status === 'In progress' || selectedData.status === 'Completed') && (
                    <>
                        <Space h="lg" />
                        <Card padding="md" radius="md" withBorder>
                            <Group justify="space-between" mb="xs">
                                <Text fw={700}>Tow Driver Details:</Text>
                            </Group>
                            <Flex align='center'>
                                <Avatar src={towDriverData.face_photo_url} size='xl' radius="md" />
                                <Flex direction='column' gap='xs' className='ml-2'>
                                    <Text size="sm" fw={500}>Name: <span className='font-normal'>{towDriverData.full_name}</span></Text>
                                    <Text size="sm" fw={500}>Phone: <span className='font-normal'>{towDriverData.phone}</span></Text>
                                    <Text size="sm" fw={500}>Vehicle: <span className='font-normal'>{towDriverData.vehicle_model}</span></Text>
                                    <Text size="sm" fw={500}>Plate Number: <span className='font-normal'>{towDriverData.vehicle_plate}</span></Text>
                                </Flex>
                            </Flex>
                            <Divider my="md" />

                            <Image src={towDriverData.vehicle_photo_url} fit="contain" />
                        </Card>
                    </>
                )}
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Stack gap='xs' className='mt-4'>
                        <Stack gap='xs'>
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
                        <Stack gap='xs'>
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

                        {
                            selectedData.status === 'In progress' && (
                                <Map bookingLocation={[selectedData.from_coordinates, towLiveLocation]} center={liveLocation} />
                            )
                        }
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
                {selectedData.status === 'In progress' && (
                    <Button
                        size="md"
                        color="blue"
                        fullWidth
                        onClick={() => handleCancelBooking()}
                    >
                        Cancel Service
                    </Button>
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
                                            <Text size='md' lineClamp={2} className='grow'>
                                                {booking.from_location} to {booking.to_location}
                                            </Text>
                                            <Space w="md" />
                                            <Text className='text-nowrap'>RM {booking.amount || 'N/A'}</Text>
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
