import { useState } from "react"
import { Button, Stack, TextInput, Space, FileInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'

import CommonLayout from "../../components/CommonLayout"

const VehicleDetails = () => {
    const [vehicleType, setType] = useState('')
    const [vehicleModel, setModel] = useState('')
    const [vehicleColor, setColor] = useState('')
    const [vehicleNumPlate, setNumPlate] = useState('')
    const [vehicleImage, setVehicleImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const navigate = useNavigate()

    const handleVehicleDetails = async () => {

        let trimType = vehicleType.trim()
        let trimModel = vehicleModel.trim()
        let trimColor = vehicleColor.trim()
        let trimNumPlate = vehicleNumPlate.trim()

        if (!trimType || !trimModel || !trimColor || !trimNumPlate || !vehicleImage) {
            notifications.show({
                title: 'Details Filling Error',
                message: 'All fields are required',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }
        navigate('/location-details')

    }

    const handleImageUpload = (file) => {
        setVehicleImage(file);

        // Generate preview
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    return (
        <CommonLayout>
            <Stack
                styles={() => ({
                    root: {
                        height: '100%',
                    }
                })}
            >
                <Stack gap="xs">
                    <p className="font-bold text-3xl mb-5">Vehicle Details</p>
                    <TextInput
                        label="Type"
                        value={vehicleType}
                        description="Example: Sedan/MPV/SUV"
                        placeholder="Enter vehicle Type"
                        onChange={(event) => setType(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Model"
                        value={vehicleModel}
                        description="Example: Proton Saga"
                        placeholder="Enter vehicle model"
                        onChange={(event) => setModel(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Color"
                        value={vehicleColor}
                        description="Example: Sliver/Black/White"
                        placeholder="Enter vehicle color"
                        onChange={(event) => setColor(event.currentTarget.value)}
                    />

                    <TextInput
                        label="NumPlate"
                        value={vehicleNumPlate}
                        description="Example: ABC1234"
                        placeholder="Enter vehicle number plate"
                        onChange={(event) => setNumPlate(event.currentTarget.value)}
                    />

                    <FileInput
                        label="Upload Vehicle Photo"
                        description="Take a photo or select from your device"
                        placeholder="Click to upload or drag file here"
                        accept="image/*"
                        onChange={(file) => handleImageUpload(file)}
                    />

                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-gray-600 text-sm">Image Preview:</p>
                            <img src={imagePreview} alt="Vehicle Preview" className="w-full max-w-xs rounded-lg" />
                        </div>
                    )}

                    <Space h="md" />
                    <Button className='w-full' onClick={() => { handleVehicleDetails() }}>Next</Button>
                </Stack>
            </Stack>
        </CommonLayout>
    )
}

export default VehicleDetails
