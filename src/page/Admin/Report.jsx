import React, { useState } from 'react'
import CommonLayout from '../../components/CommonLayout'
import { DatePickerInput } from '@mantine/dates'
import { Button, Space, Text } from '@mantine/core'
import { supabase } from '../../supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Report = () => {
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.')
            return
        }

        try {
            // Convert dates to ISO format
            const start = new Date(startDate).toISOString()
            const end = new Date(endDate).toISOString()

            const { data: bookingsData, error: fetchError } = await supabase
                .from('bookings')
                .select('user_id, id')
                .gte('created_at', start)
                .lte('created_at', end)

            if (fetchError) throw fetchError

            // Check if bookingsData is empty
            if (!bookingsData || bookingsData.length === 0) {
                setError('No bookings found for the selected date range.')
                return
            }

            // Generate PDF
            const doc = new jsPDF()
            doc.setFontSize(18)
            doc.text('Booking Report', 14, 20)

            // Add total bookings count
            const totalBookings = bookingsData.length
            doc.setFontSize(12)
            doc.text(`Total Bookings: ${totalBookings}`, 14, 30)

            autoTable(doc, {
                startY: 40,
                head: [['User ID', 'Booking ID']],
                body: bookingsData.map(booking => [
                    booking.user_id,
                    booking.id,
                ]),
            })

            doc.save('booking_report.pdf')
            setSuccess(true)
            setError(null)
        } catch (error) {
            setError('Error generating report: ' + error.message)
        }
    }

    return (
        <CommonLayout>
            <p className='font-bold text-2xl'>Report</p>

            <Space h={20} />
            <div className='w-2/6'>
                <DatePickerInput
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Select start date"
                />
            </div>
            <div className='w-2/6'>
                <DatePickerInput
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Select end date"
                />
            </div>
            
            <Space h={20} />
            <Button onClick={handleGenerateReport} disabled={!startDate || !endDate}>
                Generate Report
            </Button>

            {error && <Text color="red">{error}</Text>}
            {success && <Text color="green">Report generated successfully!</Text>}
        </CommonLayout>
    )
}

export default Report