import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications'
import CommonLayout from '../components/CommonLayout'

const Feedback = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState('');

    const handleFeedback = () => {
        if (!rating) {
            notifications.show({
                title: 'Error',
                message: 'Select Rating',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }
        navigate('/home');
    };

    return (
        <CommonLayout>
            <Stack>
                <Button onClick={() => { handleFeedback() }} size="md" radius="md">Submit Feedback</Button>
            </Stack>
        </CommonLayout>
    );
};

export default Feedback;
