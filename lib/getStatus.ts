import axios from 'axios';

const apiBaseUrl = 'https://fdmsapitest.zimra.co.zw/api'; // ZIMRA API base URL

export const getStatus = async (fiscalCode: string) => {
    try {
        const response = await axios.get(`${apiBaseUrl}/GetStatus`, {
            params: { fiscalCode },
            headers: {
                Authorization: `Bearer ${process.env.ZIMRA_API_TOKEN}`, // Your API token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching status:", error);
        throw error;
    }
};
