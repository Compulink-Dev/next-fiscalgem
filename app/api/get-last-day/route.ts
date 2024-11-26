import { NextResponse } from 'next/server';
import https from 'https';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const deviceID = process.env.DEVICE_ID;
    const url = `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/getLastFiscalDay`;
    const headers = {
        'DeviceModelName': 'Server',
        'DeviceModelVersion': 'v1',
        'Content-Type': 'application/json',
    };

    const agent = new https.Agent({
        pfx: fs.readFileSync(path.resolve('/home/kronos/clientCert.pfx')),
        passphrase: process.env.CLIENT_CERT_PASSWORD,
    });

    try {
        const data = await new Promise<string>((resolve, reject) => {
            const req = https.request(
                url,
                {
                    method: 'GET',
                    headers,
                    agent,
                },
                (res) => {
                    let body = '';

                    res.on('data', (chunk) => {
                        body += chunk;
                    });

                    res.on('end', () => {
                        resolve(body);
                    });
                }
            );

            req.on('error', (error) => {
                reject(error);
            });

            req.end();
        });

        const parsedData = JSON.parse(data);
        console.log('Last fiscal day response:', parsedData); // Log for debugging
        return NextResponse.json(parsedData);
    } catch (error) {
        console.error('Failed to fetch last fiscal day:', error);
        return NextResponse.json(
            { error: 'Failed to fetch last fiscal day.' },
            { status: 500 }
        );
    }
}
