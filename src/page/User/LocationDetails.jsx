import { useState } from "react";
import { Button, Stack, TextInput, Space, Group, ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { IconMapPin, IconLock } from "@tabler/icons-react";
import CommonLayout from "../../components/CommonLayout";
import Map from "../../components/Map" // Import the Map component

const LocationDetails = () => {
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [fromCoordinates, setFromCoordinates] = useState(null);
    const [toCoordinates, setToCoordinates] = useState(null);
    const [isStarted, setIsStarted] = useState(false);
    const [mapVisible, setMapVisible] = useState(false);
    const navigate = useNavigate();

    const handleCurrentLocation = (setLocation, setCoordinates) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ latitude, longitude });
                setLocation(`Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`);
            },
            () => {
                notifications.show({
                    title: "Location Error",
                    message: "Failed to get current location.",
                    color: "red",
                });
            }
        );
    };

    const handleStart = () => {
        if (!fromLocation || !toLocation || !fromCoordinates || !toCoordinates) {
            notifications.show({
                title: "Details Filling Error",
                message: "All fields are required.",
                color: "red",
            });
            return;
        }
        setIsStarted(true);
        setMapVisible(true);
    };

    const handleFinish = () => {
        navigate("/payment");
    };

    return (
        <CommonLayout>
            <Stack>
                <Stack gap="xs">
                    <TextInput
                        label="From"
                        value={fromLocation}
                        readOnly={isStarted}
                        placeholder="Enter starting location"
                        onChange={(e) => setFromLocation(e.currentTarget.value)}
                        rightSection={
                            <ActionIcon
                                onClick={() => handleCurrentLocation(setFromLocation, setFromCoordinates)}
                                disabled={isStarted}
                            >
                                {isStarted ? <IconLock size={16} /> : <IconMapPin size={16} />}
                            </ActionIcon>
                        }
                    />

                    <TextInput
                        label="To"
                        value={toLocation}
                        readOnly={isStarted}
                        placeholder="Enter destination location"
                        onChange={(e) => setToLocation(e.currentTarget.value)}
                        rightSection={
                            <ActionIcon
                                onClick={() => handleCurrentLocation(setToLocation, setToCoordinates)}
                                disabled={isStarted}
                            >
                                {isStarted ? <IconLock size={16} /> : <IconMapPin size={16} />}
                            </ActionIcon>
                        }
                    />

                    {!isStarted && (
                        <Button className="w-full" onClick={handleStart}>
                            Start
                        </Button>
                    )}
                </Stack>

                {mapVisible && fromCoordinates && toCoordinates && (
                    <div className="mt-4">
                        <Map
                            bookingLocation={[
                                { latitude: fromCoordinates.latitude, longitude: fromCoordinates.longitude },
                                { latitude: toCoordinates.latitude, longitude: toCoordinates.longitude },
                            ]}
                        />
                        <Button className="w-full mt-4" onClick={handleFinish}>
                            Finish
                        </Button>
                    </div>
                )}
            </Stack>
        </CommonLayout>
    );
};

export default LocationDetails;
