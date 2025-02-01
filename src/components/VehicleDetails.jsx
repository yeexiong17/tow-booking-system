import { useState } from "react"
import { Stack, TextInput, FileInput } from '@mantine/core'
import { toCamelCase } from '../helpers/HelperFunction'

const VehicleDetails = ({ vehicleDetails, setVehicleDetails }) => {
    const [imagePreview, setImagePreview] = useState(null)

    const handleImageUpload = (file) => {
        setVehicleDetails(prevDetails => ({ ...prevDetails, vehicleImage: file }))

        // Generate preview
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setImagePreview(null)
        }
    }

    const textInput = [
        {
            label: 'Type',
            value: vehicleDetails.type,
            description: 'Example: Sedan/MPV/SUV',
            placeholder: 'Enter vehicle type',
        },
        {
            label: 'Model',
            value: vehicleDetails.model,
            description: 'Example: Proton Saga',
            placeholder: 'Enter vehicle model',
        },
        {
            label: 'Color',
            value: vehicleDetails.color,
            description: 'Example: Sliver/Black/White',
            placeholder: 'Enter vehicle color',
        },
        {
            label: 'Number Plate',
            value: vehicleDetails.numberPlate,
            description: 'Example: ABC1234',
            placeholder: 'Enter vehicle number plate',
        }
    ]

    const textInputGenerator = () => {
        return textInput.map((input, index) => {
            let inputName = toCamelCase(input.label)

            return (
                <TextInput
                    key={index}
                    label={input.label}
                    value={input.value}
                    description={input.description}
                    placeholder={input.placeholder}
                    onChange={(event) => {
                        setVehicleDetails(prevDetails => ({
                            ...prevDetails,
                            [inputName]: event.target.value
                        })
                        )
                    }}
                />
            )
        })
    }

    return (
        <Stack gap="xs">
            {
                textInputGenerator()
            }

            <FileInput
                label="Upload Vehicle Photo"
                description="Take a photo or select from your device"
                placeholder="Click to upload or drag file here"
                accept="image/*"
                onChange={(file) => handleImageUpload(file)}
            />

            {
                imagePreview && (
                    <div className="mt-4">
                        <p className="text-gray-600 text-sm">Image Preview:</p>
                        <img src={imagePreview} alt="Vehicle Preview" className="w-full max-w-xs rounded-lg" />
                    </div>
                )
            }
        </Stack>
    )
}

export default VehicleDetails
