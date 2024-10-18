// app/api/close-day/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { handleError } from '@/lib/error-handler';
import { postToFDMS } from '@/lib/fdms-client';

interface CloseDayRequest {
    deviceID: string;
    fiscalDayNo: number;
    fiscalDayCounters: any;
    fiscalDayDeviceSignature: string;
    receiptCounter: number;
}


export async function POST(request: Request) {

    try {
        const { deviceID, fiscalDayNo, fiscalDayCounters, fiscalDayDeviceSignature, receiptCounter }: CloseDayRequest = await request.json();
        const response = await postToFDMS('/closeDay', { deviceID, fiscalDayNo, fiscalDayCounters, fiscalDayDeviceSignature, receiptCounter });
        return NextResponse.json(response);
    } catch (error: any) {
        return handleError(error);
    }
}
