import axios from 'axios';
import https from 'https';
import fs from 'fs';
import path from 'path';

export const postSubmitFDMS = async (endpoint: string, data: object) => {
    const deviceID = process.env.DEVICE_ID;
    const cert = fs.readFileSync(path.resolve('/home/kronos/clientCert.pfx'));
    const passphrase = process.env.CLIENT_CERT_PASSWORD;

    const httpsAgent = new https.Agent({
        pfx: cert,
        passphrase,
    });

    try {
        const response = await axios.post(`https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/${endpoint}`, data, { httpsAgent });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
        } else {
            console.error('Unexpected error:', error);
        }
        throw error; // Rethrow for further handling
    }
};
