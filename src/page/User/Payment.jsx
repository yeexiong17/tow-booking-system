import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications'
import CommonLayout from "../../components/CommonLayout";

const Payment = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');

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
        navigate('/feedback');
    };

    return (
        <CommonLayout>
            <Stack>
                <p align="center" className="font-bold text-2xl text-neutral-800 mb-2">Payment</p>
                <Stack
                    spacing="sm"
                    className="bg-blue-100 rounded-lg shadow-md p-2 w-full max-w-xl"
                >
                    <p className="text-sm text-gray-700 mb-1">Total Distance (km) x Tow Fee Per KM</p>
                    <p className="text-sm text-gray-700 mb-1">
                        Total Distance: <span className="font-medium">20 km</span>
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                        Tow Fee Per KM: <span className="font-medium">RM 5</span>
                    </p>
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                        Total Fee: <span className="text-blue-600">RM 100</span>
                    </p>
                </Stack>
                <Stack
                    spacing="sm"
                    className="bg-white rounded-lg shadow-md w-full max-w-xl"
                >
                    <p component="h2" className="text-lg font-semibold ">Payment Method:</p>
                    <Stack spacing="sm">
                        {['Touch N Go', 'FPX', 'PayPal', 'Visa'].map((method) => (
                            <label key={method} className="flex items-center">
                                <input
                                    type="radio"
                                    name="payment-method"
                                    value={method.toLowerCase()}
                                    className="form-radio text-blue-600 focus:ring-blue-500"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <p className="ml-3 text-gray-800">{method}</p>
                            </label>
                        ))}
                    </Stack>
                </Stack>
                <Button onClick={() => { handlePayment() }} size="md" radius="md">Pay</Button>
            </Stack>
        </CommonLayout>
    );
};

export default Payment;
