import axios from 'axios';
import https from 'https';
import { fetchInvoiceData, mapInvoiceToReceipt } from './palladium';

export async function submitToFDMS(invoiceId: string, deviceID: string) {
    try {
        // Fetch invoice data from Palladium
        const invoice = await fetchInvoiceData(invoiceId);

        // Map invoice data to the receipt payload structure
        const receiptPayload = mapInvoiceToReceipt(invoice);

        // Configure HTTPS agent with the certificate
        const httpsAgent = new https.Agent({
            pfx: Buffer.from(process.env.CLIENT_CERT_BASE64 as string, 'base64'),
            passphrase: process.env.CLIENT_CERT_PASSWORD,
        });

        // Submit receipt data to FDMS
        const response = await axios.post(
            `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/submitReceipt`,
            { deviceID, receipt: receiptPayload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'DeviceModelName': 'Server',
                    'DeviceModelVersion': 'v1',
                },
                httpsAgent,
            }
        );

        console.log("FDMS API Response:", response.data);

        return response.data;
    } catch (error: any) {
        console.error("Error submitting to FDMS:", error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}
