import axios from 'axios';

export async function postToFDMS(endpoint: string, data: object) {
    const headers = {
        DeviceModelName: process.env.DeviceModelName,
        DeviceModelVersionNo: process.env.DeviceModelVersionNo,
    };

    try {
        const response = await axios.post(`${process.env.ZIMRA_API_TEST_BASE_URL}${endpoint}`, data, { headers });
        return response.data;
    } catch (error: unknown) {
        // Check if the error is an AxiosError
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || error.message);
        } else {
            // Handle unknown error types
            throw new Error('An unexpected error occurred');
        }
    }
}
