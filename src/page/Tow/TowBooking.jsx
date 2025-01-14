import { Badge, Button, Divider, Card, Drawer, Flex, ScrollArea, Space, Stack, Text } from '@mantine/core';
import CommonLayout from '../../components/CommonLayout';
import {IconMapPinFilled } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import Map from '../../components/Map';
import { useState } from 'react';

const TowBooking = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [currentBooking, setCurrentBooking] = useState(null);

    const [bookings, setBookings] = useState([
        {
            id: 1,
            status: 'In progress',
            createdAt: '08/01/2025, 14:30:00',
            completedAt: null,
            from: 'Persiaran Multimedia, 63100 Cyberjaya, Selangor',
            to: 'Jalan Ayer Keroh Lama, 75450 Bukit Beruang, Melaka',
            price: 'RM 100',
            fromLocation: { latitude: 3.1385027, longitude: 101.6050874 },
            toLocation: { latitude: 2.26503, longitude: 102.28536 },
        },
        {
            id: 2,
            status: 'Completed',
            createdAt: '07/01/2025, 10:00:00',
            completedAt: '07/01/2025, 12:00:00',
            from: 'Jalan Tun Razak, Kuala Lumpur',
            to: 'Petaling Jaya, Selangor',
            price: 'RM 150',
            fromLocation: { latitude: 3.1721, longitude: 101.7007 },
            toLocation: { latitude: 3.1073, longitude: 101.6067 },
        },
    ]);

    const allBadge = {
        Pending: <Badge size="sm" color="blue">Pending</Badge>,
        'In progress': <Badge size="sm" color="yellow">In progress</Badge>,
        Completed: <Badge size="sm" color="green">Completed</Badge>,
        Canceled: <Badge size="sm" color="red">Canceled</Badge>,
    };

    const handleOpenDrawer = (booking) => {
        setCurrentBooking(booking);
        open();
    };

    const handleFinishBooking = () => {
        if (currentBooking) {
            const updatedBookings = bookings.map((b) =>
                b.id === currentBooking.id
                    ? { ...b, status: 'Completed', completedAt: new Date().toLocaleString() }
                    : b
            );
            setBookings(updatedBookings);
            close();
        }
    };

    const sortedBookings = bookings.sort((a, b) => {
        if (a.status === 'In progress' && b.status !== 'In progress') return -1;
        if (a.status !== 'In progress' && b.status === 'In progress') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

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
                    History
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
    );
};

export default TowBooking;
