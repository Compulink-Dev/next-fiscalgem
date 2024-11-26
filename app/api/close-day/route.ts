import { NextResponse } from 'next/server';
import { handleError } from '@/lib/error-handler';
import { postToFDMS } from '@/lib/fdms-client';
import axios from 'axios';

interface FiscalDayCounter {
    fiscalCounterType: string;
    fiscalCounterCurrency: string;
    fiscalCounterTaxID?: number;
    fiscalCounterTaxPercent?: number;
    fiscalCounterMoneyType?: string;
    fiscalCounterValue: number;
}

interface CloseDayRequest {
    deviceID: string;
    fiscalDayNo: number;
    fiscalDayCounters: FiscalDayCounter[];
    fiscalDayDeviceSignature: string;
    receiptCounter: number;
}


export async function POST(request: Request) {
    try {
        // Parse and validate the request data
        const { deviceID, fiscalDayNo, fiscalDayCounters, fiscalDayDeviceSignature, receiptCounter }: CloseDayRequest = await request.json();

        // Filter out counters with zero values
        const nonZeroCounters = fiscalDayCounters.filter(counter => counter.fiscalCounterValue !== 0);

        // Prepare the payload for FDMS API
        const payload = {
            deviceID,
            fiscalDayNo,
            fiscalDayCounters: nonZeroCounters,
            fiscalDayDeviceSignature,
            receiptCounter
        };

        // Post to FDMS '/closeDay' endpoint
        const response = await postToFDMS('/closeDay', payload);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        // Enhanced error handling for Axios errors
        if (axios.isAxiosError(error)) {
            return handleError(error.response?.data?.message || error.message);
        } else {
            return handleError('An unexpected error occurred');
        }
    }
}