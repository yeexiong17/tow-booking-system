import { Stack,Space } from '@mantine/core';
import loadingGif from '../images/loading.gif'

const Pending = () => {
    return (
        <Stack align="center">
            <img src={loadingGif} alt="Loading..." className=" w-20 h-20 mx-auto mt-10"/>
            <Space h="lg" />
            <Stack
                className="bg-blue-300 rounded-lg shadow-md p-4 w-full max-w-xl text-center"
            >
                <p className="text-lg font-semibold text-gray-800">Pending Assignment</p>
                <p className="text-sm text-gray-700">
                    Your request has been received and is waiting for a driver to be assigned.
                    Please hold on...
                </p>
            </Stack>

        </Stack>
    );
};

export default Pending;
