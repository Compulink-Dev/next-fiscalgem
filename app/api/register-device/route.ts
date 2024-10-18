// app/api/register-device/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { handleError } from '@/lib/error-handler';

export async function POST(request: Request) {
    const { deviceID, activationKey, certificateRequest } = await request.json();

    const headers = {
        DeviceModelName: 'YourDeviceModelName',
        DeviceModelVersionNo: 'YourDeviceModelVersion',
    };

    try {
        const response = await axios.post(
            'https://fdmsapi.zimra.co.zw/registerDevice',
            { deviceID, activationKey, certificateRequest },
            { headers }
        );
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.log("Register Error : ", error);
        return handleError(error)

    }
}