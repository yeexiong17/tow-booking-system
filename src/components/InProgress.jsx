import { Stack,Space } from '@mantine/core';
import loadingGif from '../images/loading.gif'

const InProgress = () => {
    return (
        <Stack align="center">
            <img src={loadingGif} alt="Loading..." className=" w-20 h-20 mx-auto mt-10"/>
            <Space h="lg" />
            <Stack
                className="bg-blue-300 rounded-lg shadow-md p-4 w-full max-w-xl text-center"
            >
                <p className="text-lg font-semibold text-gray-800">In Progress</p>
                <p className="text-sm text-gray-700">
                    shows all the details of tow driver and current position
                </p>
            </Stack>

        </Stack>
    );
};

export default InProgress;
