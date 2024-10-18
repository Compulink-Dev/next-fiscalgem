// app/api/submit-file/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

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
        DeviceModelName: 'YourDeviceModelName',
        DeviceModelVersionNo: 'YourDeviceModelVersion',
    };

    try {
        const response = await axios.post(
            'https://fdmsapi.zimra.co.zw/submitFile',
            fileData,
            { headers }
        );
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
