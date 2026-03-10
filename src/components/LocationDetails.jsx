import { useState } from "react"
import { Stack, TextInput, ActionIcon } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconMapPin, IconLock } from "@tabler/icons-react"
import Map from "./Map"

const LocationDetails = ({ locationDetails, setLocationDetails }) => {
    const [isStarted] = useState(false)

    const handleCurrentLocation = (location, coordinates) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setLocationDetails(prevDetails => ({
                    ...prevDetails,
                    [coordinates]: { latitude, longitude },
                    [location]: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`
                }))
            },
            () => {
                notifications.show({
                    title: "Location Error",
                    message: "Failed to get current location.",
                    className: 'w-5/6 ml-auto',
                    position: 'top-right',
                    color: "red",
                })
            }
        )
    }

    return (
        <Stack gap="xs">
            <TextInput
                label="From"
                value={locationDetails.fromLocation}
                readOnly={isStarted}
                placeholder="Enter starting location"
                onChange={(e) => setLocationDetails(prevDetails => ({
                    ...prevDetails,
                    fromLocation: e.target.value
                }))}
                rightSection={
                    <ActionIcon
                        onClick={() => handleCurrentLocation("fromLocation", "fromCoordinates")}
                        disabled={isStarted}
                    >
                        {isStarted ? <IconLock size={16} /> : <IconMapPin size={16} />}
                    </ActionIcon>
                }
            />

            <TextInput
                label="To"
                value={locationDetails.toLocation}
                readOnly={isStarted}
                placeholder="Enter destination location"
                onChange={(e) => setLocationDetails(prevDetails => ({
                    ...prevDetails,
                    toLocation: e.target.value
                }))}
                rightSection={
                    <ActionIcon
                        onClick={() => handleCurrentLocation("toLocation", "toCoordinates")}
                        disabled={isStarted}
                    >
                        {isStarted ? <IconLock size={16} /> : <IconMapPin size={16} />}
                    </ActionIcon>
                }
            />

            {
                !Object.values(locationDetails).some(value => value === '' || value === null) && (
                    <div className="mt-4">
                        <Map
                            bookingLocation={[
                                { latitude: locationDetails.fromCoordinates.latitude, longitude: locationDetails.fromCoordinates.longitude },
                                { latitude: locationDetails.toCoordinates.latitude, longitude: locationDetails.toCoordinates.longitude },
                            ]}
                            center={{ latitude: locationDetails.fromCoordinates.latitude, longitude: locationDetails.toCoordinates.longitude }}
                            workshopIcon={true}
                        />
                    </div>
                )
            }
        </Stack>
    )
}

export default LocationDetails
