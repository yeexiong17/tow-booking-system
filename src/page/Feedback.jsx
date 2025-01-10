import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications'
import CommonLayout from '../components/CommonLayout'
import { IconStar } from '@tabler/icons-react';

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
    );
};

const Feedback = () => {
    const navigate = useNavigate();
    const [serviceRating, setServiceRating] = useState('');
    const [systemRating, setSystemRating] = useState('');
    const [comments, setComments] = useState('');

    const handleFeedback = () => {
        if (!serviceRating || !systemRating) {
            notifications.show({
                title: 'Error',
                message: 'Select Rating',
                className: 'w-5/6 ml-auto',
                position: 'top-right',
                color: 'red'
            })
            return
        }
        notifications.show({
            title: 'Thank You!',
            message: 'Your feedback has been submitted.',
            className: 'w-5/6 ml-auto',
            position: 'top-right',
            color: 'green',
        });
        navigate('/home');
    };

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
                <Button onClick={() => { handleFeedback() }} size="md" radius="md">Submit Feedback</Button>
            </Stack>
        </CommonLayout>
    );
};

export default Feedback;
