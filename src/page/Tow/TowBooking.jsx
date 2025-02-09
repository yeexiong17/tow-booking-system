import { useState, useEffect } from 'react';
import { Badge, Button, Divider, Card, Drawer, Flex, ScrollArea, Space, Stack, Text } from '@mantine/core'
import CommonLayout from '../../components/CommonLayout'
import { IconMapPinFilled } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import Map from '../../components/Map'
import { supabase } from '../../supabase';
import { useAuth } from '../../Context';
import { convertToMalaysiaTime } from '../../helpers/HelperFunction';

const TowBooking = () => {
    const [opened, { open, close }] = useDisclosure(false)
    const [currentBooking, setCurrentBooking] = useState(null)
    const [bookings, setBookings] = useState([]);
    const { userData } = useAuth();

    useEffect(() => {
        fetchTowBookings();
    }, []);

    const fetchTowBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select()
                .eq('tow_id', userData.id)

            if (error) throw new Error(error)

            setBookings(data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleFinishBooking = async () => {
        try {
            // Find the first pending booking
            const pendingBooking = bookings.find((b) => b.status === 'In Progress');

            if (!pendingBooking) {
                console.log("No In Progress bookings found.");
                return;
            }

            // Update in Supabase
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'Completed', completed_at: new Date().toISOString() })
                .eq('id', pendingBooking.id);

            if (error) throw error;

            // Update state after successful database update
            setBookings((prevBookings) =>
                prevBookings.map((b) =>
                    b.id === pendingBooking.id
                        ? { ...b, status: 'Completed', completedAt: new Date().toLocaleString() }
                        : b
                )
            );

            // Close the drawer
            close();
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };
    const allBadge = {
        // No tow driver being assigned yet
        'Pending': <Badge size="sm" color="blue">Pending</Badge>,
        // Tow driver is on the way to pick up the vehicle
        'In progress': <Badge size="sm" color="yellow">In progress</Badge>,
        // Everything completed, vehicle delivered to the destination
        'Completed': <Badge size="sm" color="green">Completed</Badge>,
        // Booking canceled by the user
        'Canceled': <Badge size="sm" color="red">Canceled</Badge>,
    }

    const handleOpenDrawer = (booking) => {
        setCurrentBooking(booking)
        open()
    }

    const sortedBookings = bookings.sort((a, b) => {
        if (a.status === 'In progress' && b.status !== 'In progress') return -1
        if (a.status !== 'In progress' && b.status === 'In progress') return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return (
        <CommonLayout>
            <Drawer
                position="bottom"
                size="100%"
                opened={opened}
                onClose={close}
                title="Booking Details"
            >
                {currentBooking && (
                    <Stack spacing="lg">
                        <Card padding="md" radius="md" withBorder>
                            <Stack>
                                <Text size="sm" fw={500}>
                                    Status: {allBadge[currentBooking.status]}
                                </Text>
                                <Text size="sm" fw={500}>
                                    Created At: {currentBooking.createdAt}
                                </Text>
                                <Text size="sm" fw={500}>
                                    Completed At: {currentBooking.completedAt || '-'}
                                </Text>
                                <Text size="sm" fw={500}>
                                    Price: {currentBooking.price}
                                </Text>
                            </Stack>
                        </Card>

                        <Card padding="md" radius="md" withBorder>
                            <Stack>
                                <Flex>
                                    <IconMapPinFilled className="text-blue-500 mr-2" />
                                    <Text fw={500}>From:</Text>
                                    <Space w="sm" />
                                    <Text c="dimmed">{currentBooking.from}</Text>
                                </Flex>
                                <Flex>
                                    <IconMapPinFilled className="text-red-500 mr-2" />
                                    <Text fw={500}>To:</Text>
                                    <Space w="sm" />
                                    <Text c="dimmed">{currentBooking.to}</Text>
                                </Flex>
                                <Map
                                    bookingLocation={[
                                        currentBooking.fromLocation,
                                        currentBooking.toLocation,
                                    ]}
                                />
                            </Stack>
                        </Card>

                        {currentBooking.status === 'In progress' && (
                            <Button
                                size="md"
                                color="blue"
                                fullWidth
                                onClick={handleFinishBooking}
                            >
                                Finish Booking
                            </Button>
                        )}
                    </Stack>
                )}
            </Drawer>

            <Stack>
                <Text fw="bold" size="xl" mb="sm">
                    Bookings
                </Text>
                <ScrollArea>
                    {/* In Progress Cards */}
                    {sortedBookings.some((booking) => booking.status === 'In progress') && (
                        <div>
                            {sortedBookings
                                .filter((booking) => booking.status === 'In progress')
                                .map((booking) => (
                                    <Card
                                        key={booking.id}
                                        padding="md"
                                        radius="md"
                                        shadow="xs"
                                        withBorder
                                        onClick={() => handleOpenDrawer(booking)}
                                    >
                                        <Stack>
                                            {allBadge[booking.status]}
                                            <Flex>
                                                <Text lineClamp={2}>
                                                    {booking.from} to {booking.to}
                                                </Text>
                                                <Text ml="auto">{booking.price}</Text>
                                            </Flex>
                                            <Text size="sm" c="dimmed">
                                                {booking.createdAt}
                                            </Text>
                                        </Stack>
                                    </Card>
                                ))}
                            {/* Divider to separate pinned and completed cards */}
                            <Divider my="lg" label="Completed Bookings" labelPosition="center" />
                        </div>
                    )}

                    {/* Completed Cards */}
                    {sortedBookings
                        .filter((booking) => booking.status !== 'In progress')
                        .map((booking) => (
                            <Card
                                key={booking.id}
                                padding="md"
                                radius="md"
                                shadow="xs"
                                withBorder
                                onClick={() => handleOpenDrawer(booking)}
                            >
                                <Stack>
                                    {allBadge[booking.status]}
                                    <Flex>
                                        <Text lineClamp={2}>
                                            {booking.from} to {booking.to}
                                        </Text>
                                        <Text ml="auto">{booking.price}</Text>
                                    </Flex>
                                    <Text size="sm" c="dimmed">
                                        {booking.createdAt}
                                    </Text>
                                </Stack>
                            </Card>
                        ))}
                </ScrollArea>
            </Stack>
        </CommonLayout>
    )
}

export default TowBooking
