import { NextResponse } from 'next/server';
import https from 'https';
import fs from 'fs';
import path from 'path';

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
        const requestBody = await request.json();

        // Log incoming request for debugging
        console.log('Received close day request body:', requestBody);

        const { deviceID, fiscalDayNo, fiscalDayCounters, fiscalDayDeviceSignature, receiptCounter }: CloseDayRequest = requestBody;

        // Ensure the required fields exist
        if (!deviceID || !fiscalDayNo || !fiscalDayCounters || !fiscalDayDeviceSignature || !receiptCounter) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Filter out counters with zero values
        const nonZeroCounters = fiscalDayCounters.filter(counter => counter.fiscalCounterValue !== 0);

        const url = `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/CloseDay`;
        const headers = {
            'DeviceModelName': 'Server',
            'DeviceModelVersion': 'v1',
            'Content-Type': 'application/json',
        };

        const agent = new https.Agent({
            pfx: fs.readFileSync(path.resolve('/home/kronos/clientCert.pfx')),
            passphrase: process.env.CLIENT_CERT_PASSWORD,
        });

        // Create the payload
        const payload = {
            deviceID,
            fiscalDayNo,
            fiscalDayCounters: nonZeroCounters,
            fiscalDayDeviceSignature,
            receiptCounter
        };

        // Wrap https.request in a Promise
        const responseData = await new Promise<string>((resolve, reject) => {
            const req = https.request(
                url,
                {
                    method: 'POST',
                    headers,
                    agent,
                },
                (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => resolve(data));
                    res.on('error', reject);
                }
            );

            req.on('error', reject);
            req.write(JSON.stringify(payload)); // Write the payload
            req.end();
        });

        const parsedData = JSON.parse(responseData);
        console.log('ZIMRA response:', parsedData); // Log the response for debugging
        return NextResponse.json(parsedData);
    } catch (error) {
        console.error('Failed to close fiscal day:', error);
        return NextResponse.json(
            { error: 'Failed to close fiscal day.' },
            { status: 500 }
        );
    }
}
