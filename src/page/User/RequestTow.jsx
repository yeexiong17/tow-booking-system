import React, { useEffect, useState } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { Button, Group, Stepper, TextInput } from '@mantine/core'
import VehicleDetails from '../../components/VehicleDetails'
import LocationDetails from '../../components/LocationDetails'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import Payment from '../../components/Payment'
import Pending from '../../components/Pending'
import InProgress from '../../components/InProgress'
import { useAuth } from '../../Context'
import { supabase } from '../../supabase'
import { assignDriverToBooking } from '../../supabase';
import {
    IconCarFilled,
    IconMapPinFilled,
    IconLoader
} from '@tabler/icons-react'

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

    // New state for user input locations
    const [fromLocation, setFromLocation] = useState('')
    const [toLocation, setToLocation] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [bookingId, setBookingId] = useState(null)
    const [bookingStatus, setBookingStatus] = useState('')

    useEffect(() => {
        if (!userData?.id) return;

        const interval = setInterval(async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('id, status')
                .eq('user_id', userData.id)
                .eq('status', 'Pending')
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                console.error(error);
                return;
            }

            if (data) {
                setBookingId(data.id);
                setBookingStatus(data.status);

                const result = await assignDriverToBooking(data.id);
                if (result.success) {
                    console.log('Driver assigned');
                } else {
                    console.log('No available drivers, booking remains pending');
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [userData.id]);

    useEffect(() => {
        const checkPendingBooking = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('id, status')
                .eq('user_id', userData.id)
                .in('status', ['Pending', 'In progress', 'Unpaid'])
                .maybeSingle();
            if (!data) {
                return;
            }
            if (error && error.code !== 'PGRST116') return

            if (data) {
                setBookingId(data.id)
                setBookingStatus(data.status)
                if (data.status === 'Pending') {
                    setActive(3)
                } else if (data.status === 'In progress') {
                    setActive(4)
                } else if (data.status === 'Unpaid') {
                    setActive(5)
                }
            }
        }

        checkPendingBooking()
    }, [userData.id])

    useEffect(() => {
        if (!bookingId) return;

        const checkStatus = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('status')
                .eq('id', bookingId)
                .maybeSingle();

            if (!error && data.status !== bookingStatus) {
                setBookingStatus(data.status);
                if (data.status === 'Unpaid')
                    setActive(5);
                else if (data.status === 'Canceled')
                    setActive(0);
                else if (data.status === 'Pending')
                    setActive(3)
                else if (data.status === 'In progress')
                    setActive(4);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000);

        return () => clearInterval(interval);
    }, [bookingId, bookingStatus]);

    const handleStepChange = (nextStep) => {
        if (nextStep > 4 || nextStep < 0) return

        const isVehicleDetailsIncomplete = Object.entries(vehicleDetails)
            .some(([key, value]) => (key !== 'vehicleImage' && value.trim() === '') || (key === 'vehicleImage' && value === null))

        const isLocationDetailsIncomplete = (Object.values(locationDetails).some(value => value === '' || value === null) ||
            (!fromLocation.trim()) ||
            (!toLocation.trim()))

        if ((isVehicleDetailsIncomplete && nextStep === 1) || (isLocationDetailsIncomplete && nextStep === 2) || (paymentMethod.length === 0 && nextStep === 3)) {
            notifications.show({
                title: 'Step Error',
                message: 'Please fill in all the fields',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }
        if (!isLocationDetailsIncomplete && nextStep === 3) {
            insertBooking()
        }

        setActive(nextStep)
    }

    const generateUniqueFilePath = () => {
        const shortUserId = userData.id.split("-")[0]
        const now = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kuala_Lumpur", hour12: false })
            .replace(/[/, ]/g, "")
            .replace(/:/g, "")

        return `${shortUserId}_${now}`
    }

    const uploadImageToSupabase = async () => {

        let uniqueFileName = generateUniqueFilePath()

        const { error: uploadError } = await supabase
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

            if (bookingId) {
                const { error } = await supabase
                    .from('bookings')
                    .update({ status: 'Completed' })
                    .eq('id', bookingId)

                if (error) throw error
            }
            const { data, error } = await supabase
                .from('bookings')
                .select('tow_id')
                .eq('id', bookingId)
                .single()
            console.log(data)
            if (data) {
                const { error } = await supabase
                    .from('profiles')
                    .update({ status: 'active' })
                    .eq('id', data.tow_id)
                if (error) throw error
            }

            if (error) throw error

            notifications.show({
                title: 'Thank You!',
                message: 'Transaction Completed',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'green',
            })

            navigate('/home')
        } catch (error) {
            notifications.show({
                title: 'Payment Error',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red',
            })
        } finally {
            toggle()
        }
    }

    const insertBooking = async () => {
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
                    vehicle_plate: vehicleDetails.numberPlate,
                    from_location: fromLocation,
                    to_location: toLocation,
                    amount: 100
                })
                .select('id')
                .single();

            if (error) throw error

            notifications.show({
                title: 'Booking',
                message: 'Booking Requested',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'blue',
            })
        } catch (error) {
            notifications.show({
                title: 'Booking Error',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red',
            })
        }
        finally {
            toggle()
        }
    }
    const handleCancelRequest = async () => {
        try {
            toggle()

            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('user_id', userData.id)
                .eq('status', 'Pending')

            if (error) throw error

            setBookingId(null)
            setBookingStatus('')
            setActive(0)

            notifications.show({
                title: 'Booking Cancelled',
                message: 'Your request has been cancelled successfully.',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'blue',
            })
        } catch (error) {
            notifications.show({
                title: 'Cancellation Error',
                message: error.message,
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red',
            })
        } finally {
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
                    allowNextStepsSelect={false}
                    styles={() => ({
                        step: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'left',
                        },
                        stepBody: {
                            margin: '8px 0px 0px',
                        },
                        stepLabel: {
                            textAlign: 'right',
                        },
                        stepDescription: {
                            textAlign: 'center',
                        },
                    })}
                >
                    <Stepper.Step icon={<IconCarFilled size={20} />} label="Vehicle Details">
                        <VehicleDetails vehicleDetails={vehicleDetails} setVehicleDetails={setVehicleDetails} />
                    </Stepper.Step>
                    <Stepper.Step icon={<IconMapPinFilled size={20} />} label="Location">
                        <LocationDetails locationDetails={locationDetails} setLocationDetails={setLocationDetails} />
                        <TextInput
                            label="From Location"
                            value={fromLocation}
                            onChange={(event) => setFromLocation(event.currentTarget.value)}
                            placeholder="Enter your starting location"
                        />
                        <TextInput
                            label="To Location"
                            value={toLocation}
                            onChange={(event) => setToLocation(event.currentTarget.value)}
                            placeholder="Enter your destination"
                        />
                    </Stepper.Step>
                    <Stepper.Step size={20} label="Payment">
                        <Payment setPaymentMethod={setPaymentMethod} />
                    </Stepper.Step>
                    <Stepper.Step icon={<IconLoader size={20} />} label="Pending">
                        <Pending />
                    </Stepper.Step>
                    <Stepper.Step icon={<IconLoader size={20} />} label="In Progress">
                        <InProgress />
                    </Stepper.Step>
                </Stepper>
                <Group justify="center" mt="xl">
                    {
                        active > 0 && active !== 2 && active !== 3 && active !== 4 && <Button variant="default" onClick={() => handleStepChange(active - 1)}>Back</Button>
                    }

                    {
                        active === 0 ? (
                            <Button onClick={() => handleStepChange(1)}>Next</Button>
                        ) : active === 1 ? (
                            <Button onClick={() => handleStepChange(2)}>Next</Button>
                        ) : active === 2 ? (
                            <>
                                <Button onClick={() => handleStepChange(active + 1)}>Proceed to payment</Button>
                                <Button onClick={() => handleCancelRequest()}>Cancel Request</Button>
                            </>
                        ) : active === 4 ? (
                            <Button onClick={() => handlePayment()}>Proceed to payment</Button>
                        ) : null
                    }
                </Group>
            </>
        </CommonLayout>
    )
}

export default RequestTow
