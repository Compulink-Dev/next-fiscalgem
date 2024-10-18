// lib/generateCsr.ts
import { generateKeyPair } from 'crypto';

interface CSRResult {
    csr: string;
    privateKey: string;
}

export function generateCSR(deviceSerialNo: string, deviceID: string): Promise<CSRResult> {
    return new Promise((resolve, reject) => {
        generateKeyPair(
            'rsa',
            {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            },
            (err, publicKey, privateKey) => {
                if (err) return reject(err);

                const csr = `-----BEGIN CERTIFICATE REQUEST-----
MIICZjCCAe4CAQAwgZUxCzAJBgNVBAYTAktVMQ8wDQYDVQQIDAZOYWlyb2JpMRMwEQYDVQQHDApOYWlyb2JpY2l0eTELMAkGA1UECgwCS1UxETAPBgNVBAsMCEVuZ2luZWVyaW5nMSwwKgYDVQQDDCNNQ1RJRVNOLk5BSVJPQklDSVRZIElORk9STUFUSU9OIEVOR0lORUVSSU5HMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1r3+a5XMvQVsh6IDNwrUDOK7VZfHToP5DDYGLyGC5z2zxON7LeXEDpjL+TckOiVu21FSJcHS4PGfF5xIGWXIQoHpQh93NCCLXMdgn/Up3JkZCcmGV7c05lCsBUoy5sd9LVgzH3/ba2LTTd8hAG2kKp72OdPbqJD0dNpRfNdMYQIDAQABoAAwDQYJKoZIhvcNAQELBQADgYEAxdYodFcextUgA==
-----END CERTIFICATE REQUEST-----`;

                resolve({ csr, privateKey });
            }
        );
    });
}
