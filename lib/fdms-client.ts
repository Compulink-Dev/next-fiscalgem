import axios from 'axios';

export async function postToFDMS(endpoint: string, data: object) {
    const headers = {
        DeviceModelName: process.env.DEVICE_MODEL_NAME!,
        DeviceModelVersionNo: process.env.DEVICE_MODEL_VERSION!,
    };

    try {
        const response = await axios.post(`${process.env.ZIMRA_API_URL}${endpoint}`, data, { headers });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message);
    }
}
