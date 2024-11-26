import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
    const deviceID = process.env.DEVICE_ID;
    const url = `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/getLastFiscalDay`;
    const headers = {
        'DeviceModelName': 'Server',
        'DeviceModelVersion': 'v1',
        'Content-Type': 'application/json',
    };

    const agent = new https.Agent({
        pfx: Buffer.from(process.env.CLIENT_CERT_BASE64 as string, 'base64'),
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

        // Log the raw data for debugging purposes
        console.log('Raw response data:', data);

        if (!data) {
            throw new Error('Empty response body received.');
        }

        // Try parsing the data only if it's not empty
        const parsedData = JSON.parse(data);

        // Log parsed data for debugging
        console.log('Last fiscal day response:', parsedData);

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error('Failed to fetch last fiscal day:', error);
        return NextResponse.json(
            { error: 'Failed to fetch last fiscal day.' },
            { status: 500 }
        );
    }
}
