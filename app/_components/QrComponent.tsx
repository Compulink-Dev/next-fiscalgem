'use client'
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRProps {
    value: string;
}

const QRCodeComponent: React.FC<QRProps> = ({ value = "" }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    useEffect(() => {
        if (!value) return;

        QRCode.toDataURL(value)
            .then((url) => setQrCodeUrl(url))
            .catch((err) => console.error("Error generating QR code:", err));
    }, [value]);

    return (
        <div>
            {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" />
            ) : (
                <p>Loading QR Code...</p>
            )}
        </div>
    );
};


export default QRCodeComponent;
