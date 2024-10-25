import { NextResponse } from 'next/server';
import { handleError } from '@/lib/error-handler';
import { postToFDMS } from '@/lib/fdms-client';
import axios from 'axios';

interface CloseDayRequest {
    deviceID: string;
    fiscalDayNo: number;
    fiscalDayCounters: Record<string, unknown>; // Replace 'any' with a more specific type
    fiscalDayDeviceSignature: string;
    receiptCounter: number;
}

export async function POST(request: Request) {
    try {
        const { deviceID, fiscalDayNo, fiscalDayCounters, fiscalDayDeviceSignature, receiptCounter }: CloseDayRequest = await request.json();
        const response = await postToFDMS('/closeDay', { deviceID, fiscalDayNo, fiscalDayCounters, fiscalDayDeviceSignature, receiptCounter });
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}
