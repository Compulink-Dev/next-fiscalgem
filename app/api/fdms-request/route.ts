// app/api/fdms-request/route.ts
import https from 'https';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// Define types for the expected body, if needed
interface RequestBody {
    // Define properties according to your request body structure
    field1: string;
    field2: number;
}

export async function POST(req: NextRequest) {
    try {
        // Parse the incoming request body as JSON
        const body: RequestBody = await req.json();

        // Define the HTTPS request options
        const options = {
            hostname: 'fdmsapi.zimra.co.zw',
            port: 443,
            path: '/your-endpoint',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            key: fs.readFileSync(path.join(process.cwd(), 'certs/private-key.pem')),
            cert: fs.readFileSync(path.join(process.cwd(), 'certs/client-cert.pem')),
            ca: fs.readFileSync(path.join(process.cwd(), 'certs/ca-cert.pem')),
            rejectUnauthorized: true,
        };

        // Make the HTTPS request
        const httpsReq = https.request(options, (httpsRes) => {
            let data = '';

            httpsRes.on('data', (chunk) => {
                data += chunk;
            });

            httpsRes.on('end', () => {
                // Return the HTTPS response as a NextResponse object
                return NextResponse.json({
                    status: httpsRes.statusCode,
                    data: JSON.parse(data),
                });
            });
        });

        httpsReq.on('error', (error) => {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
        });

        // Write the request body to the HTTPS request
        httpsReq.write(JSON.stringify(body));
        httpsReq.end();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Bad Request', error }, { status: 400 });
    }
}
