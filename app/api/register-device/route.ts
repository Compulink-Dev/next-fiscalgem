import { NextResponse } from 'next/server';
import axios from 'axios';
import { handleError } from '@/lib/error-handler';

export async function POST(request: Request) {
    const { deviceID, activationKey, certificateRequest } = await request.json();

    const headers = {
        'DeviceModelName': 'Server', // Modify this as per your requirements
        'DeviceModelVersion': 'v1',
        'Content-Type': 'application/json'
    };

    try {
        // The endpoint has {deviceID} as a path parameter
        const response = await axios.post(`https://fdmsapitest.zimra.co.zw/Public/v1/${deviceID}/RegisterDevice`,
            {
                activationKey,
                certificateRequest
            },
            { headers });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
