import React, { useEffect, useState } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { Button, Group, Stepper } from '@mantine/core'
import VehicleDetails from '../../components/VehicleDetails'
import LocationDetails from '../../components/LocationDetails'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import Payment from '../../components/Payment'

const RequestTow = () => {

    const [active, setActive] = useState(0)
    const navigate = useNavigate()

    // Vehicle Details
    const [vehicleDetails, setVehicleDetails] = useState({
        type: '',
        model: '',
        color: '',
        numberPlate: '',
        vehicleImage: null
    })
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

    const handlePayment = () => {
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
        notifications.show({
            title: 'Thank You!',
            message: 'Transaction Completed.',
            className: 'w-5/6 ml-auto',
            position: 'top-right',
            color: 'green',
        })
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
