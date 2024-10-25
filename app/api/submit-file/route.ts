// app/api/submit-file/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { handleError } from '@/lib/error-handler';

export async function POST(request: Request) {
    const { deviceID, fiscalDayNo, fiscalDayOpened, receipts, fiscalDayClosed, fileSequence } = await request.json();

    const fileData = {
        header: {
            deviceID,
            fiscalDayNo,
            fiscalDayOpened,
            fileSequence
        },
        content: {
            receipts
        },
        footer: {
            fiscalDayCounters: [
                {
                    fiscalCounterType: "SaleByTax",
                    fiscalCounterCurrency: "USD",
                    fiscalCounterTaxPercent: 15,
                    fiscalCounterTaxID: 0,
                    fiscalCounterMoneyType: "Cash",
                    fiscalCounterValue: 28.75
                }
            ],
            fiscalDayDeviceSignature: {
                hash: "Yjkjy =",
                signature: "Yy ="
            },
            receiptCounter: receipts.length,
            fiscalDayClosed
        }
    };

    const headers = {
        'DeviceModelName': 'Server', // Modify this as per your requirements
        'DeviceModelVersion': 'v1',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(
            `https://fdmsapitest.zimra.co.zw/Public/v1/${deviceID}/RegisterDevice`,
            fileData,
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
