import { NextResponse } from 'next/server';
import https from 'https';
import fs from 'fs';
import path from 'path';

export async function fetchData(endpoint: string, errorMessage: string) {
    const deviceID = process.env.DEVICE_ID;
    const url = `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/${endpoint}`;
    const headers = {
        'DeviceModelName': 'Server',
        'DeviceModelVersion': 'v1',
        'Content-Type': 'application/json'
    };

    const agent = new https.Agent({
        pfx: fs.readFileSync(path.resolve('/home/kronos/clientCert.pfx')),
        passphrase: process.env.CLIENT_CERT_PASSWORD,
    });

    return new Promise<NextResponse>((resolve) => {
        https.get(url, { agent, headers }, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(NextResponse.json(jsonData));
                } catch (error) {
                    console.error('Error parsing response:', error);
                    resolve(
                        NextResponse.json({ error: 'Invalid JSON response' }, { status: 500 })
                    );
                }
            });
        }).on('error', (error) => {
            console.error(errorMessage, error);
            resolve(
                NextResponse.json({ error: errorMessage }, { status: 500 })
            );
        });
    });
}