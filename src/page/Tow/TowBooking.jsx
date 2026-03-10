import { useState, useEffect, useCallback } from 'react'
import { Badge, Button, Divider, Group, Image, Card, Drawer, Flex, ScrollArea, Space, Stack, Text } from '@mantine/core'
import CommonLayout from '../../components/CommonLayout'
import { Link } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { IconArrowNarrowRight, IconMapPinFilled } from '@tabler/icons-react'
import Map from '../../components/Map'
import { supabase } from '../../supabase'
import { useAuth } from '../../Context'
import { convertToMalaysiaTime } from '../../helpers/HelperFunction'

const TowBooking = () => {
    const [opened, { open, close }] = useDisclosure(false)
    const [bookings, setBookings] = useState([])
    const { userData, liveLocation } = useAuth()
    const [selectedData, setSelectedData] = useState([])
    const [userLiveLocation, setUserLiveLocation] = useState({ latitude: 0, longitude: 0 })

    const getUserLocation = useCallback(async () => {
        const filteredData = bookings.filter(item => item.status === "In progress")
        console.log('getting user location...')
        if (filteredData.length > 0) {
            const { data, error } = await supabase
                .from('locations')
                .select()
                .eq('user_id', filteredData[0].user_id)

            if (error) {
                console.error(error)
                return
            }

            if (data && data.length > 0) {
                console.log(data[0].latitude, data[0].longitude)
                setUserLiveLocation({ latitude: data[0].latitude, longitude: data[0].longitude })
            }
        }
    }, [bookings])

    const fetchTowBookings = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select()
                .eq('tow_id', userData.id)
                .order('created_at', { ascending: false })

            if (error) throw new Error(error);
            const statusOrder = { "Pending": 1, "In progress": 2, "Unpaid": 3, "Completed": 4, "Canceled": 5 };
            const sortedData = data.sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || new Date(b.created_at) - new Date(a.created_at));
            setBookings(sortedData)
        } catch (error) {
            console.log(error)
        }
    }, [userData.id])

    useEffect(() => {
        fetchTowBookings()
    }, [fetchTowBookings])

    useEffect(() => {
        if (selectedData.length === 0) return

        const interval = setInterval(getUserLocation, 2000)

        return () => clearInterval(interval)
    }, [selectedData, getUserLocation])

    const allBadge = {
        'Pending': <Badge size="sm" color="blue">Pending</Badge>,
        'In progress': <Badge size="sm" color="yellow">In progress</Badge>,
        'Completed': <Badge size="sm" color="green">Completed</Badge>,
        'Canceled': <Badge size="sm" color="red">Canceled</Badge>,
        "Unpaid": <Badge size='sm' color="orange">Unpaid</Badge>,
    }

    const handleOpenDrawer = (booking) => {
        console.log(booking)
        setSelectedData(booking)
        open()
    }

    const handleFinishBooking = async () => {
        try {
            if (!selectedData.id || selectedData.status !== 'In progress') return

            // Update the booking status to "Completed"
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({ status: 'Completed', completed_at: new Date().toISOString() })
                .eq('id', selectedData.id)

            if (bookingError) throw bookingError

            // Update the driver's status in the profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ status: 'active' })
                .eq('id', selectedData.tow_id)

            if (profileError) throw profileError

            // Update the state to reflect the changes
            setBookings((prevBookings) =>
                prevBookings.map((b) =>
                    b.id === selectedData.id ? { ...b, status: 'Completed', completed_at: new Date().toISOString() } : b
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
            <Drawer position='bottom' size='100%' opened={opened} onClose={close} title="Booking Details">
                <Card padding="md" radius="md" withBorder>
                    <Stack>
                        <Flex align="center" gap="xs">
                            <Text size="sm" fw={500}>Status:</Text>
                            {allBadge[selectedData.status]}
                        </Flex>
                        <Text size="sm" fw={500}>From: {selectedData.from_location}</Text>
                        <Text size="sm" fw={500}>To: {selectedData.to_location}</Text>
                        <Text size="sm" fw={500}>Created At: {convertToMalaysiaTime(selectedData.created_at)}</Text>
                        <Text size="sm" fw={500}>Completed At: {selectedData.completed_at ? convertToMalaysiaTime(selectedData.completed_at) : '-'}</Text>
                    </Stack>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Card.Section>
                        <Image src={selectedData.vehicle_image_url} height={150} fit="contain" />
                    </Card.Section>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700}>Vehicle Details:</Text>
                    </Group>
                    <Text size="sm" fw={500}>Type: {selectedData.vehicle_type}</Text>
                    <Text size="sm" fw={500}>Model: {selectedData.vehicle_model}</Text>
                    <Text size="sm" fw={500}>Color: {selectedData.vehicle_color}</Text>
                    <Text size="sm" fw={500}>Plate: {selectedData.vehicle_plate}</Text>
                </Card>
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
                                <Card padding="md" radius="md" withBorder>
                                    <Map bookingLocation={[userLiveLocation, selectedData.to_coordinates]} center={liveLocation} />
                                </Card>
                            )
                        }
                    </Stack>
                </Card>

                {selectedData.status === 'In progress' && (
                    <Button
                        size="md"
                        color="blue"
                        fullWidth
                        onClick={() => handleFinishBooking()}
                    >
                        Complete Service
                    </Button>
                )}
            </Drawer>
            <Stack>
                <Text fw="bold" size="xl" mb="sm">Bookings</Text>
                <ScrollArea>
                    {bookings.filter((booking) => booking.status === 'In progress').map((booking) => (
                        <Card key={booking.id} shadow="xs" padding="md" radius="md" withBorder onClick={() => handleOpenDrawer(booking)}>
                            <Stack>
                                {allBadge[booking.status]}
                                <Flex>
                                    <Text size='md' lineClamp={2} className='grow'>
                                        {booking.from_location} to {booking.to_location}
                                    </Text>
                                    <Space w="md" />
                                    <Text className='text-nowrap'>RM {booking.amount || 'N/A'}</Text>
                                </Flex>
                                <Flex>
                                    <Text size='sm' c='dimmed'>{convertToMalaysiaTime(booking.created_at)}</Text>
                                    <Link className='flex items-center ml-auto text-blue-600'>
                                        <Text size='sm' fw={500}>View Details</Text>
                                        <IconArrowNarrowRight stroke={2} />
                                    </Link>
                                </Flex>
                            </Stack>
                        </Card>
                    ))}
                    <Divider my="lg" label="Completed Bookings" labelPosition="center" />
                    {bookings.filter((booking) => booking.status !== 'In progress').map((booking) => (
                        <Card key={booking.id} shadow="xs" padding="md" radius="md" withBorder onClick={() => handleOpenDrawer(booking)}>
                            <Stack>
                                {allBadge[booking.status]}
                                <Flex>
                                    <Text size='md' lineClamp={2} className='grow'>
                                        {booking.from_location} to {booking.to_location}
                                    </Text>
                                    <Space w="md" />
                                    <Text className='text-nowrap'>RM {booking.amount || 'N/A'}</Text>
                                </Flex>
                                <Flex>
                                    <Text size='sm' c='dimmed'>{convertToMalaysiaTime(booking.created_at)}</Text>
                                    <Link className='flex items-center ml-auto text-blue-600'>
                                        <Text size='sm' fw={500}>View Details</Text>
                                        <IconArrowNarrowRight stroke={2} />
                                    </Link>
                                </Flex>
                            </Stack>
                        </Card>
                    ))}
                </ScrollArea>
            </Stack>
        </CommonLayout>
    );
};

export default TowBooking;
