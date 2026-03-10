import { useEffect, useState } from 'react';
import { Anchor, Avatar, Button, Card, Drawer, Flex, Group, Image, ScrollArea, Space, Stack, Table, Text, Select } from '@mantine/core';
import CommonLayout from '../../components/CommonLayout';
import { useDisclosure } from '@mantine/hooks';
import { supabase } from '../../supabase';
import { convertToMalaysiaTime } from "../../helpers/HelperFunction";

const ManageUserAndTow = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [userData, setUserData] = useState([]);
    const [towDataProfiles, setTowDataProfiles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUserData();
        fetchTowData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('role', 'user');

            if (error) throw new Error(error);
            setUserData(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTowData = async () => {
        try {
            const { data: towDetails, error: towError } = await supabase
                .from('tow_driver_details')
                .select(`
                    user_id,
                    identification_card_photo_url,
                    identification_number,
                    full_name,
                    license_photo_url,
                    vehicle_photo_url,
                    vehicle_model,
                    vehicle_plate
                `)
                .neq('status', 'unverified');

            if (towError) throw towError;
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select()
                .eq('role', 'tow');

            if (profileError) throw profileError;
            const mergedData = profiles.map(profile => {
                const towDetail = towDetails.find(tow => tow.user_id === profile.id);
                return {
                    ...profile,
                    ...towDetail
                };
            });

            setTowDataProfiles(mergedData);
        } catch (error) {
            console.error("Fetch Tow Data Error:", error);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        open();
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedUser) return;

        try {
            // Update the status in the profiles table
            const { error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', selectedUser.id);

            if (error) throw error;

            // Refresh the data
            fetchTowData();
            setSelectedUser(prev => ({ ...prev, status: newStatus })); // Update local state
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const userRows = userData.map((item, index) => (
        <Table.Tr key={index}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={30} src={item.profile_picture} radius={30} />
                    <Text fz="sm" fw={500}>
                        {item.name}
                    </Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Anchor component="button" size="sm">
                    {item.email}
                </Anchor>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item?.phone || ' - '}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <Button variant="default" onClick={() => handleViewDetails(item)}>
                        View Details
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    const towRows = towDataProfiles.map((item, index) => (
        <Table.Tr key={index}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={30} src={item.profile_picture || "https://cdn-icons-png.flaticon.com/512/179/179573.png"} radius={30} />
                    <Text fz="sm" fw={500}>{item.name}</Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Anchor component="button" size="sm">{item.email || '-'}</Anchor>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item?.phone || '-'}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <Button variant="default" onClick={() => handleViewDetails(item)}>View Details</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <CommonLayout>
            <p className='font-bold text-2xl'>User</p>
            <ScrollArea type='always' h={320} className='px-2 mt-2'>
                <Table withTableBorder stickyHeader verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{userRows}</Table.Tbody>
                </Table>
            </ScrollArea>

            <Space h={50} />

            <p className='font-bold text-2xl'>Tow Driver</p>
            <ScrollArea type='always' h={320} className='px-2 mt-2'>
                <Table withTableBorder stickyHeader verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{towRows}</Table.Tbody>
                </Table>
            </ScrollArea>

            {/* Drawer for displaying user/tow details */}
            <Drawer position='right' offset={8} radius="md" opened={opened} onClose={close} title="Details">
                {selectedUser && (
                    <ScrollArea className='h-full'>
                        <Stack className='h-full'>
                            {selectedUser.role === 'user' && (
                                <Card shadow="xs" padding="sm" radius="md" withBorder>
                                    <p className='font-bold'>Personal Details</p>
                                    <Image
                                        src={selectedUser.profile_picture || 'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg'}
                                        height={50}
                                    />
                                    <Space h="xs" />
                                    <Flex className='items-center'>
                                        <Space w="md" />
                                        <div className='py-4'>
                                            <Text><span className='font-bold'>Id: </span>{selectedUser.id}</Text>
                                            <Text><span className='font-bold'>Name: </span>{selectedUser.name}</Text>
                                            <Text><span className='font-bold'>Email: </span>{selectedUser.email}</Text>
                                            <Text><span className='font-bold'>Phone: </span>{selectedUser.phone || '-'}</Text>
                                            <Text><span className="font-bold">Date Time Joined: </span>{convertToMalaysiaTime(selectedUser.created_at)}</Text>
                                        </div>
                                    </Flex>
                                </Card>
                            )}
                            {selectedUser.role === 'tow' && (
                                <Card shadow="xs" padding="sm" radius="md" withBorder>
                                    <p className='font-bold'>Personal Details</p>
                                    <Space h="xs" />
                                    <Text><span className='font-bold'>Id: </span>{selectedUser.id}</Text>
                                    <Text><span className="font-bold">Date Time Joined: </span>{convertToMalaysiaTime(selectedUser.created_at)}</Text>
                                    <Flex className='items-center'>
                                        <Avatar
                                            src={selectedUser.profile_picture || 'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg'}
                                            radius="lg"
                                            size="xl"
                                        />
                                        <Space w="md" />
                                        <div className='py-4'>
                                            <Text><span className='font-bold'>Name: </span>{selectedUser.name}</Text>
                                            <Text><span className='font-bold'>Email: </span>{selectedUser.email}</Text>
                                            <Text><span className='font-bold'>Phone: </span>{selectedUser.phone || '-'}</Text>
                                        </div>
                                    </Flex>
                                </Card>
                            )}
                            {selectedUser.role === 'tow' && (
                                <Card shadow="xs" padding="sm" radius="md" withBorder>
                                    <p className='font-bold'>Identification Details</p>
                                    <Space h="xs" />
                                    <Stack className='items-center'>
                                        <Image
                                            radius="md"
                                            src={selectedUser.identification_card_photo_url || "https://cdn-icons-png.flaticon.com/512/179/179573.png"}
                                        />
                                        <div>
                                            <Text><span className='font-bold'>Full Name: </span>{selectedUser.full_name}</Text>
                                            <Text><span className='font-bold'>Identification Number: </span>{selectedUser.identification_number || '-'}</Text>
                                        </div>
                                    </Stack>
                                </Card>
                            )}
                            {selectedUser.role === 'tow' && (
                                <Card shadow="xs" padding="sm" radius="md" withBorder>
                                    <p className='font-bold'>Driving License</p>
                                    <Space h="xs" />
                                    <Stack className='items-center'>
                                        <Image
                                            radius="md"
                                            src={selectedUser.license_photo_url || "https://cdn-icons-png.flaticon.com/512/179/179573.png"}
                                            styles={() => ({
                                                root: {
                                                    aspectRatio: '3/2',
                                                }
                                            })}
                                        />
                                    </Stack>
                                </Card>
                            )}
                            {selectedUser.role === 'tow' && (
                                <Card shadow="xs" padding="sm" radius="md" withBorder>
                                    <p className='font-bold'>Vehicle Details</p>
                                    <Space h="xs" />
                                    <Stack className='items-center'>
                                        <Image radius="md" src={selectedUser.vehicle_photo_url || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"} />
                                        <div>
                                            <Text><span className='font-bold'>Model: </span>{selectedUser.vehicle_model || '-'}</Text>
                                            <Text><span className='font-bold'>Plate Number: </span>{selectedUser.vehicle_plate || '-'}</Text>
                                        </div>
                                    </Stack>
                                </Card>
                            )}
                            {(selectedUser.role === 'tow' && selectedUser.status !== 'working') &&(
                                <Card shadow="xs" padding="sm" radius="md" withBorder>
                                    <p className='font-bold'>Status</p>
                                    <Space h="xs" />
                                    <Select
                                        data={[
                                            { value: 'active', label: 'Active' },
                                            { value: 'unactive', label: 'Unactive' }
                                        ]}
                                        value={selectedUser.status}
                                        onChange={(value) => handleStatusChange(value)}
                                        placeholder="Select status"
                                    />
                                </Card>
                            )}
                        </Stack>
                    </ScrollArea>
                )}
            </Drawer>
        </CommonLayout>
    );
};

export default ManageUserAndTow;