'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react'; // Make sure this import is correct

interface QRProps {
    deviceID: string;
    receiptDate: string;
    receiptGlobalNo: string;
    receiptDeviceSignature: string;
}

const QRCodeComponent: React.FC<QRProps> = ({ deviceID, receiptDate, receiptGlobalNo, receiptDeviceSignature }) => {
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchQrUrl = async () => {
            const response = await fetch('/api/generate-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceID,
                    receiptDate,
                    receiptGlobalNo,
                    receiptDeviceSignature,
                }),
            });

            const data = await response.json();
            setQrUrl(data.qrUrl);
        };

        fetchQrUrl();
    }, [deviceID, receiptDate, receiptGlobalNo, receiptDeviceSignature]);

    return (
        <div>
            {qrUrl ? (
                <QRCode value={qrUrl} size={256} />
            ) : (
                <p>Loading QR code...</p>
            )}
        </div>
    );
};

export default QRCodeComponent; // Ensure you are using default export
