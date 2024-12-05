'use client'
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { useReceiptStore } from '@/lib/useReceiptStore';

export default function SuccessPage() {
    const { receiptSignature, qrUrl, md5Hash16, finalPayload } = useReceiptStore();

    if (!receiptSignature) return <div>No data available</div>;

    return (
        <div className="p-8">
            <div className="bg-green-400 text-green-950 rounded p-4 text-sm w-full">
                <h3 className="my-2 font-bold text-lg">Receipt Signature</h3>
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <strong>Hash:</strong>
                        <span>{receiptSignature.hash}</span>
                    </div>
                    <div className="flex gap-2">
                        <strong>Signature:</strong>
                        <span>{receiptSignature.signature}</span>
                    </div>
                    {qrUrl && (
                        <div>
                            <p className="font-bold my-2">
                                MD5 Hash: <span className="font-normal">{md5Hash16}</span>
                            </p>0
                            <QRCode value={qrUrl} />
                            <p className="font-bold">Receipt Qr Data:</p>
                            <div className="bg-white p-2 rounded">
                                <Link href={qrUrl} target="_blank">
                                    <p className="text-xs w-auto">{qrUrl}</p>
                                </Link>
                            </div>
                        </div>
                    )}
                    {finalPayload ? (
                        <div className="text-ellipsis text-xs overflow-hidden" style={{ wordBreak: "break-all" }}>
                            <h3 className="font-bold">Final Payload to API:</h3>
                            <pre className="text-xs">{finalPayload}</pre>
                        </div>
                    ) : (
                        <p>No Final Data</p>
                    )}
                </div>
            </div>
        </div>
    );
}
