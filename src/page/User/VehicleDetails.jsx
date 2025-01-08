import { useState } from "react"
import { Button, Stack, TextInput, Space} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import CommonLayout from "../../components/CommonLayout"

const SignUp = () => {
    const [vehicleType, setType] = useState('')
    const [vehicleModel, setModel] = useState('')
    const [vehicleColor, setColor] = useState('')
    const [vehicleNumPlate, setNumPlate] = useState('')

    const handleSignUp = async () => {

        let trimType = vehicleType.trim()
        let trimModel = vehicleModel.trim()
        let trimColor = vehicleColor.trim()
        let trimNumPlate = vehicleNumPlate.trim()

        if (!trimType || !trimModel || !trimColor || trimNumPlate) {
            notifications.show({
                title: 'Details Filling Error',
                message: 'All fields are required',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }
    }

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

                    <Space h="md" />
                    <Button className='w-full' onClick={() => {/* handleVehicleDetails */}}>Next</Button>
                </Stack>
            </Stack>
        </CommonLayout >
    )
}

export default SignUp
