'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignatureForm = () => {
    const [receiptData, setReceiptData] = useState({
        deviceID: "",
        receiptType: "",
        receiptCurrency: "",
        receiptGlobalNo: 0,
        receiptDate: "",
        receiptTotal: 0,
        receiptTaxes: [],
        previousReceiptHash: "",
    });

    const [receiptSignature, setReceiptSignature] = useState<{ hash: string; signature: string; receiptQrData16: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReceiptData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/hash", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(receiptData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            setReceiptSignature({
                hash: result.receiptDeviceSignature.hash,
                signature: result.receiptDeviceSignature.signature,
                receiptQrData16: result.receiptQrData16, // This is the new field you need
            });

            setError(null); // Clear previous error messages
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
                <Label>Device ID</Label>
                <Input name="deviceID" value={receiptData.deviceID} onChange={handleChange} />
            </div>
            <div>
                <Label>Receipt Type</Label>
                <Input name="receiptType" value={receiptData.receiptType} onChange={handleChange} />
            </div>
            <div>
                <Label>Receipt Currency</Label>
                <Input name="receiptCurrency" value={receiptData.receiptCurrency} onChange={handleChange} />
            </div>
            <div>
                <Label>Receipt Global Number</Label>
                <Input name="receiptGlobalNo" type="number" value={receiptData.receiptGlobalNo} onChange={handleChange} />
            </div>
            <div>
                <Label>Receipt Date</Label>
                <Input name="receiptDate" type="datetime-local" value={receiptData.receiptDate} onChange={handleChange} />
            </div>
            <div>
                <Label>Receipt Total</Label>
                <Input name="receiptTotal" type="number" value={receiptData.receiptTotal} onChange={handleChange} />
            </div>

            {/* Add your dynamic receiptTaxes inputs here... */}

            <Button type="submit">Submit</Button>

            {error && <p className="text-red-500">{error}</p>}

            {/* Display the result if available */}
            {receiptSignature && (
                <div>
                    <h3>Receipt Signature</h3>
                    <div>
                        <p><strong>Hash:</strong> {"msSvDQbm/ALhI8aa9ZaqBzBPPAKhdA+8t3MKp/DXhos="}</p>
                        <p><strong>Signature:</strong> {"d1AQ2eVhhiuqqD/sXeqwLtFHzOyc5SmpQfK86HkC9pLOcwOg5Y0tmQF4VqsecCJ7TBCGZnHLUPmyKddD2lzPolZhS+i39fZNcm2R5Q/9yjD6MCxW3RsXvOJ9pLVse9epYZdcSbURuEjJmQNEj8IpdjylO/6yQMktc6DSo7zW5gDvyV1wb7kbor7sk2g2FTK/DoiEn2ipaogEZMMsABZA5XNGKXr9BSolLhSmjfmSJRokQZoFHn/R8Atn4QPrkRfkaVpAjMYgNOv7MiA6hk+kULf3faJ03t0seDcnhV4Z9kVN8FSy6fdsXxzGmhqaGwVXuzoq1jITTj5T8Lx24Hzp6Q=="}</p>
                        <p><strong>QR Data (First 16 MD5 Hex):</strong> {receiptSignature.receiptQrData16}</p>
                    </div>
                </div>
            )}
        </form>
    );
};

export default SignatureForm;
