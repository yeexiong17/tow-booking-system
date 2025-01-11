import { useEffect, useState } from 'react'
import Map from '../../components/Map'
import { getLocation } from '../../supabase'
import CommonLayout from '../../components/CommonLayout'

const BookingDetails = () => {

    const [bookingLocation, setBookingLocation] = useState(null)

    useEffect(() => {

        const getLocationById = async () => {
            let res = await getLocation()

            if (!res.success) alert(res.message)

            setBookingLocation(res.data)
        }

        getLocationById()

    }, [])

    return (
        <CommonLayout navShouldShow={false}>

        </CommonLayout>
    )
}

export default BookingDetails
