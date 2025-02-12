import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Stack, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import CommonLayout from '../components/CommonLayout'
import { IconStar } from '@tabler/icons-react'
import { supabase } from '../supabase'
import { useAuth } from '../Context'

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
                <IconStar
                    key={value}
                    size={30}
                    className={`cursor-pointer ${value <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    onClick={() => setRating(value)}
                />
            ))}
        </div>
    )
}

const Feedback = () => {
    const { userData } = useAuth()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const userId = query.get('userId')
    const bookingId = query.get('bookingId')

    // Log the values to check if they are being set correctly
    console.log('User ID:', userId)
    console.log('Booking ID:', bookingId)

    const navigate = useNavigate()
    const [serviceRating, setServiceRating] = useState('')
    const [systemRating, setSystemRating] = useState('')
    const [comments, setComments] = useState('')
    const [error, setError] = useState(null)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        console.log('Submitting feedback:', { userId, bookingId, serviceRating, systemRating, comments })

        if (isSubmitted) {
            notifications.show({
                title: 'Feedback Already Submitted',
                message: 'You have already submitted feedback for this booking.',
                color: 'yellow',
            })
            return
        }

        try {
            const { data, error } = await supabase
                .from('feedbacks')
                .insert([
                    {
                        user_id: userId,
                        booking_id: bookingId,
                        service_rating: serviceRating,
                        system_rating: systemRating,
                        comment: comments,
                        user_role: userData.user_metadata.role
                    }
                ])
                .select()

            if (error) throw error

            setIsSubmitted(true)
            setServiceRating('')
            setSystemRating('')
            setComments('')
            notifications.show({
                title: 'Thank You!',
                message: 'Your feedback has been submitted.',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'green',
            })
            navigate('/home')
        } catch (error) {
            notifications.show({
                title: 'Error Submitting Feedback',
                message: error.message,
                color: 'red',
            })
        }
    }

    return (
        <CommonLayout>
            <p align="center" className="font-bold text-2xl text-neutral-800 mb-2">Feedback</p>
            <Stack className="mb-5">
                <p>Rate the Service Provider:</p>
                <StarRating rating={serviceRating} setRating={setServiceRating} />
            </Stack>
            <Stack className="mb-5">
                <p>Rate the System Functioning:</p>
                <StarRating rating={systemRating} setRating={setSystemRating} />
            </Stack>
            <TextInput
                className="h-20"
                label="Comments"
                value={comments}
                placeholder="Leave Your Comments Here (Optional)"
                onChange={(event) => setComments(event.currentTarget.value)}
            />
            <Stack>
                <Button
                    onClick={handleSubmit}
                    size="md"
                    radius="md"
                    disabled={isSubmitted}
                    style={{ backgroundColor: isSubmitted ? 'gray' : undefined }}
                >
                    {isSubmitted ? 'Feedback Submitted' : 'Submit Feedback'}
                </Button>
                <Button onClick={() => navigate('/home')} size="md" radius="md">Cancel</Button>
            </Stack>
        </CommonLayout>
    )
}

export default Feedback
