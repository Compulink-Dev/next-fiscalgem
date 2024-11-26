import { NextResponse } from 'next/server';
import https from 'https';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();

        // Log incoming request for debugging
        console.log('Received request body:', requestBody);

        const { openDayRequest } = requestBody;

        // Ensure the required fields exist
        if (!openDayRequest || !openDayRequest.fiscalDayOpened) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const deviceID = process.env.DEVICE_ID;
        const url = `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/OpenDay`;
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
            fiscalDayOpened: openDayRequest.fiscalDayOpened,
            ...(openDayRequest.fiscalDayNo !== undefined ? { fiscalDayNo: openDayRequest.fiscalDayNo } : {}),
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
        console.error('Failed to open fiscal day:', error);
        return NextResponse.json(
            { error: 'Failed to open fiscal day.' },
            { status: 500 }
        );
    }
}
