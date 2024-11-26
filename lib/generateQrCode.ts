// utils/generateQrCode.ts
import QRCode from 'qrcode';

export const generateQrCode = async (
    qrUrl: string,
    deviceID: string,
    receiptDate: string,
    receiptGlobalNo: string,
    receiptQrData: string
): Promise<string> => {
    const qrCodeString = `${qrUrl}${deviceID}${receiptDate}${receiptGlobalNo}${receiptQrData}`;
    return QRCode.toDataURL(qrCodeString); // Generate a QR code as a base64 string
};
