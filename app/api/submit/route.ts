import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import Receipt from '@/models/Receipt';
import dbConnect from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Parse the incoming request body
        const { deviceID, receipt } = await request.json();
        console.log('Received payload in /api/submit:', { deviceID, receipt });

        // Validate the receipt data and deviceID
        if (!deviceID || !receipt || Object.keys(receipt).length === 0) {
            console.error("Error: DeviceID or receipt data is missing in the request body.");
            return NextResponse.json(
                { success: false, error: "DeviceID or receipt data is missing in the request body." },
                { status: 400 }
            );
        }

        // Ensure that the necessary fields exist within the receipt object
        if (!receipt.receiptType || !receipt.receiptCurrency || !receipt.receiptCounter) {
            console.error('Validation Error: Missing required fields in receipt data.');
            return NextResponse.json(
                { success: false, error: 'Incomplete receipt data. Ensure all required fields are provided.' },
                { status: 400 }
            );
        }

        const headers = {
            'Content-Type': 'application/json',
            'DeviceModelName': 'Server',
            'DeviceModelVersion': 'v1',
        };

        // Path to the client certificate
        const certPath = path.resolve('/home/kronos/clientCert.pfx');

        // Check if the client certificate exists
        if (!fs.existsSync(certPath)) {
            console.error(`Client certificate not found at: ${certPath}`);
            return NextResponse.json(
                { success: false, error: `Client certificate not found at: ${certPath}` },
                { status: 500 }
            );
        }

        // Load certificate and create the httpsAgent
        const httpsAgent = new https.Agent({
            pfx: fs.readFileSync(certPath),
            passphrase: process.env.CLIENT_CERT_PASSWORD,
        });

        // Log the parsed receipt data for debugging
        console.log("Parsed Data from Request:", receipt);

        const body = {
            deviceID,
            receipt,
        };

        console.log("Outgoing Payload:", JSON.stringify(body, null, 2));

        // Send receipt data to the FDMS API
        const response = await axios.post(
            `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/submitReceipt`,
            body,
            { headers, httpsAgent }  // Use httpsAgent here for SSL authentication
        );

        console.log('FDMS API response:', response.data);

        // Save the receipt data to MongoDB
        const savedReceipt = await Receipt.create(receipt);

        // Respond with success, including both API response and saved document
        return NextResponse.json({
            success: true,
            apiResponse: response.data,
            savedReceipt,
        });

    } catch (error: any) {
        // Handle errors: check if the error is from the FDMS API or something else
        const errorMessage = error.response?.data || error.message || 'An unexpected error occurred';
        console.error('Error submitting receipt:', errorMessage);

        // Handle FDMS API errors or connection issues
        if (error.response) {
            console.error('FDMS API Error:', error.response.data);
            return NextResponse.json(
                { success: false, error: error.response.data },
                { status: error.response.status }
            );
        } else if (error.request) {
            console.error('FDMS API No Response:', error.request);
            return NextResponse.json(
                { success: false, error: 'No response from FDMS API.' },
                { status: 500 }
            );
        } else {
            console.error('Unexpected Error:', errorMessage);
            return NextResponse.json(
                { success: false, error: errorMessage },
                { status: 500 }
            );
        }
    }
}
