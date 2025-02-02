import { useEffect } from "react"
import { Button, Card, Drawer, Group, Image, Space, Text } from "@mantine/core"
import CommonLayout from "../components/CommonLayout"
import { useDisclosure } from "@mantine/hooks"
import { useAuth } from "../Context"
import { useNavigate } from "react-router-dom"
import { convertToMalaysiaTime } from "../helpers/HelperFunction"

const Profile = () => {
    const { signOut, userData } = useAuth()
    const [opened, { open, close }] = useDisclosure(false)
    const { user_metadata } = userData
    const navigate = useNavigate()

    useEffect(() => {
        open()
    }, [open])

    const handleClose = () => {
        close()
        navigate(-1)
    }

    return (
        <CommonLayout>
            <Drawer
                position="bottom"
                size="100%"
                onClose={handleClose}
                opened={opened}
                title='Profile'
                styles={() => ({
                    title: {
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                    },
                })}
            >
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Card.Section>
                        <Image
                            src='https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg'// {`${user_metadata.profile_picture}`}
                            height={50}
                        />
                    </Card.Section>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700}>Basic Information:</Text>
                    </Group>

                    <Text size="sm" fw={500}>ID      : <span className="font-normal">{userData?.id}</span></Text>
                    <Text size="sm" fw={500}>Username: <span className="font-normal">{user_metadata?.name}</span></Text>
                    <Text size="sm" fw={500}>Role    : <span className="font-normal">{user_metadata?.role}</span></Text>
                    <Text size="sm" fw={500}>Status  : <span className="font-normal">{user_metadata?.status}</span></Text>
                </Card>
                <Space h="lg" />
                <Card padding="md" radius="md" withBorder>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700}>Contact Information:</Text>
                    </Group>

                    <Text size="sm" fw={500}>Email   : <span className="font-normal">{user_metadata?.email}</span></Text>
                    <Text size="sm" fw={500}>Phone: <span className="font-normal">{userData?.phone || 'No phone added'}</span></Text>
                    <Text size="sm" fw={500}>Date Time Joined:</Text>
                    <span className="font-normal">{convertToMalaysiaTime(userData.created_at)}</span>
                </Card>
                <Button size='md' onClick={() => signOut()} color="blue" fullWidth mt="md" radius="md">Log Out</Button>
            </Drawer>
        </CommonLayout>
    )
}

export default Profile
