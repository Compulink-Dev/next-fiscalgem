// app/api/open-day/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { postToFDMS } from '@/lib/fdms-client';
import { handleError } from '@/lib/error-handler';

export async function POST(request: Request) {
    const { deviceID, fiscalDayOpened, fiscalDayNo } = await request.json();

    const headers = {
        DeviceModelName: 'YourDeviceModelName',
        DeviceModelVersionNo: 'YourDeviceModelVersion',
    };

    try {
        const response = await postToFDMS('/openDay', { deviceID, fiscalDayOpened, fiscalDayNo });
        return NextResponse.json(response.data);
    } catch (error: any) {
        return handleError(error)
    }
}
