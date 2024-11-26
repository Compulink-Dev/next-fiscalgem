// src/services/submitReceipt.ts
import https from 'https';
import fs from 'fs';
import path from 'path';


//@ts-ignore
export async function submitReceipt(data) {
    const url = `https://fdmsapitest.zimra.co.zw/Device/v1/${data.deviceID}/submitReceipt`;

    const agent = new https.Agent({
        pfx: fs.readFileSync(path.resolve('/home/kronos/clientCert.pfx')),
        passphrase: process.env.CLIENT_CERT_PASSWORD,
    });

    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            agent,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    resolve(parsedData);
                } catch (error) {
                    console.log("Error", error);

                    reject('Failed to parse response data.');
                }
            });
        });

        req.on('error', (error) => {
            console.error('Failed to submit receipt:', error);
            reject('Failed to submit receipt.');
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}
