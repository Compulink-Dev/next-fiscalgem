import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import https from 'https';

let cachedConfigData: any = null; // Temporary storage for device config data

export async function POST(request: Request) {
    const headers = {
        'DeviceModelName': 'Server',
        'DeviceModelVersionNo': 'v1',
        'Content-Type': 'application/json'
    };

    try {
        const { deviceID } = await request.json();

        // Load PFX certificate
        const clientCert = fs.readFileSync(path.resolve('/home/kronos/clientCert.pfx'));
        const passphrase = 'Kronos95.'; // Add the passphrase for the PFX file if necessary

        const response = await axios.get(
            `https://fdmsapitest.zimra.co.zw/Device/v1/${deviceID}/getConfig`,
            {
                headers,
                httpsAgent: new https.Agent({
                    pfx: clientCert,
                    passphrase,
                    rejectUnauthorized: true,
                }),
            }
        );

        cachedConfigData = response.data; // Cache the config data temporarily
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching config:', error);
        return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
    }
}

export async function GET() {
    if (cachedConfigData) {
        return NextResponse.json(cachedConfigData);
    }
    return NextResponse.json({ error: 'No configuration data available' }, { status: 404 });
}
