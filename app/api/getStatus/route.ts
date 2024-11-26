import { NextResponse } from 'next/server';
import https from 'https';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const deviceID = process.env.DEVICE_ID;
    const url = `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/getStatus`;
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
        // Wrap the https.get in a promise for async/await support
        const data = await new Promise<string>((resolve, reject) => {
            https.get(url, { agent, headers }, (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    resolve(body);
                });

                res.on('error', reject);
            }).on('error', reject);
        });

        const parsedData = JSON.parse(data); // Parse the response
        return NextResponse.json(parsedData); // Return the parsed response
    } catch (error) {
        console.error('Failed to fetch status data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch status data.' },
            { status: 500 }
        );
    }
}
