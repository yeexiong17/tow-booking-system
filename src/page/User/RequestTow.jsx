import React, { useEffect, useState } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { Button, Group, Stepper } from '@mantine/core'
import VehicleDetails from '../../components/VehicleDetails'
import LocationDetails from '../../components/LocationDetails'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import Payment from '../../components/Payment'
import { useAuth } from '../../Context'
import { supabase } from '../../supabase'

const RequestTow = () => {

    const [active, setActive] = useState(0)
    const { toggle, userData } = useAuth()
    const navigate = useNavigate()

    // Vehicle Details
    const [vehicleDetails, setVehicleDetails] = useState({
        type: '',
        model: '',
        color: '',
        numberPlate: '',
        vehicleImage: null
    })

    // Location Details
    const [locationDetails, setLocationDetails] = useState({
        fromLocation: '',
        fromCoordinates: null,
        toLocation: '',
        toCoordinates: null
    })

    const [paymentMethod, setPaymentMethod] = useState('')

    const handleStepChange = (nextStep) => {

        if (nextStep > 3 || nextStep < 0) return

        const isVehicleDetailsIncomplete = Object.entries(vehicleDetails)
            .some(([key, value]) => (key !== 'vehicleImage' && value.trim() === '') || (key === 'vehicleImage' && value === null))

        const isLocationDetailsIncomplete = Object.values(locationDetails).some(value => value === '' || value === null)

        if ((isVehicleDetailsIncomplete && nextStep === 1) || (isLocationDetailsIncomplete && nextStep === 2)) {
            notifications.show({
                title: 'Step Error',
                message: 'Please fill in all the fields',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }

        setActive(nextStep)
    }

    const generateUniqueFilePath = () => {
        const shortUserId = userData.id.split("-")[0]
        const now = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kuala_Lumpur", hour12: false })
            .replace(/[\/, ]/g, "")
            .replace(/:/g, "")

        return `${shortUserId}_${now}`
    }

    const uploadImageToSupabase = async () => {

        let uniqueFileName = generateUniqueFilePath()

        const { uploadData, uploadError } = await supabase
            .storage
            .from('bucket')
            .upload(`booking_vehicle_image/${uniqueFileName}.jpg`, vehicleDetails.vehicleImage, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) throw new Error(uploadError)

        const { data } = supabase.storage.from('bucket').getPublicUrl(`booking_vehicle_image/${uniqueFileName}.jpg`)

        return data.publicUrl
    }

    const handlePayment = async () => {
        if (!paymentMethod) {
            notifications.show({
                title: 'Error',
                message: 'Select Payment Method',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }

        try {
            toggle()
            const car_photo_url = await uploadImageToSupabase()

            const { error } = await supabase
                .from('bookings')
                .insert({
                    user_id: userData.id,
                    status: 'Pending',
                    from_coordinates: locationDetails.fromCoordinates,
                    to_coordinates: locationDetails.toCoordinates,
                    vehicle_image_url: car_photo_url,
                    vehicle_type: vehicleDetails.type,
                    vehicle_model: vehicleDetails.model,
                    vehicle_color: vehicleDetails.color,
                    vehicle_plate: vehicleDetails.numberPlate
                })

            if (error) throw error
            notifications.show({
                title: 'Thank You!',
                message: 'Transaction Completed.',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'green',
            })
        } catch (error) {
            notifications.show({
                title: 'Transaction Error',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red',
            })
        }
        finally {
            toggle()
        }

        navigate('/home')

    }

    return (
        <CommonLayout>
            <>
                <Stepper
                    size='sm'
                    active={active}
                    styles={() => ({
                        step: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        stepBody: {
                            margin: '8px 0 0',
                        },
                        stepLabel: {
                            textAlign: 'center',
                        },
                        stepDescription: {
                            textAlign: 'center',
                        },
                    })}
                >
                    <Stepper.Step label="Enter Vehicle Details">
                        <VehicleDetails vehicleDetails={vehicleDetails} setVehicleDetails={setVehicleDetails} />
                    </Stepper.Step>
                    <Stepper.Step label="Enter Location">
                        <LocationDetails locationDetails={locationDetails} setLocationDetails={setLocationDetails} />
                    </Stepper.Step>
                    <Stepper.Completed>
                        <Payment setPaymentMethod={setPaymentMethod} />
                    </Stepper.Completed>
                </Stepper>
                <Group justify="center" mt="xl">
                    {
                        active > 0 && <Button variant="default" onClick={() => handleStepChange(active - 1)}>Back</Button>

                    }

                    {
                        active < 2
                            ? <Button onClick={() => handleStepChange(active + 1)}>Next</Button>
                            : <Button onClick={() => handlePayment()}>Proceed to payment</Button>
                    }
                </Group>
            </>
        </CommonLayout>
    )
}

export default RequestTow
