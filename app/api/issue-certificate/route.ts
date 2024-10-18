// app/api/issue-certificate/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { deviceID, certificateRequest } = await request.json();

    const headers = {
        DeviceModelName: 'YourDeviceModelName',
        DeviceModelVersionNo: 'YourDeviceModelVersion',
    };

    try {
        const response = await axios.post(
            'https://fdmsapi.zimra.co.zw/issueCertificate',
            { deviceID, certificateRequest },
            { headers }
        );
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
