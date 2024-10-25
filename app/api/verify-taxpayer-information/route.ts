// app/api/verify-taxpayer-information/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { handleError } from '@/lib/error-handler';

export async function POST(request: Request) {
    const { deviceID, activationKey, deviceSerialNo } = await request.json();

    const headers = {
        DeviceModelName: process.env.DeviceModelName,
        DeviceModelVersionNo: process.env.DeviceModelVersionNo,
    };

    try {
        const response = await axios.post(
            'https://fdmsapitest.zimra.co.zw/verifyTaxpayerInformation',
            { deviceID, activationKey, deviceSerialNo },
            { headers }
        );
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
