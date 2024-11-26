'use client';
import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';

interface Item {
    code: string;
    description: string;
    quantity: number;
    price: number;
    vat: number;
}

interface Receipt {
    seller: {
        name: string;
        tin: string;
        address: string;
        email: string;
        phone: string;
    };
    buyer: {
        name: string;
        tin: string;
        address: string;
        email: string;
        phone: string;
    };
    invoiceNo: string;
    date: string;
    deviceSerialNo: string;
    fiscalDayNo: number;
    items: Item[];
    totalAmount: number;
    totalVat: number;
}

// Transform Payload to Receipt
const transformPayloadToReceipt = (payload: any): Receipt => {
    const receipt = payload.receipt;

    return {
        seller: {
            name: "Your Company Name", // Assuming static details
            tin: "1234567890",
            address: "Your Company Address",
            email: "your-email@example.com",
            phone: "+123456789",
        },
        buyer: {
            name: receipt.buyerData.buyerRegisterName,
            tin: receipt.buyerData.buyerTIN,
            address: `${receipt.buyerData.buyerAddress.street}, ${receipt.buyerData.buyerAddress.city}`,
            email: receipt.buyerData.buyerContacts.email,
            phone: receipt.buyerData.buyerContacts.phoneNo,
        },
        invoiceNo: receipt.invoiceNo,
        date: receipt.receiptDate,
        deviceSerialNo: "Device Serial Placeholder", // Adjust if needed
        fiscalDayNo: 0, // Adjust if missing
        items: receipt.receiptLines.map((line: any) => ({
            code: line.receiptLineHSCode,
            description: line.receiptLineName,
            quantity: line.receiptLineQuantity,
            price: line.receiptLinePrice,
            vat: (line.taxPercent / 100) * line.receiptLinePrice, // VAT calculation
        })),
        totalAmount: receipt.receiptTotal,
        totalVat: receipt.receiptTaxes.reduce((acc: number, tax: any) => acc + tax.taxAmount, 0),
    };
};

const InvoicePage = () => {
    const [receiptData, setReceiptData] = useState<Receipt | null>(null);
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulated payload
        const payload = {
            deviceID: 19034,
            receipt: {
                receiptType: "0",
                receiptCurrency: "USD",
                receiptCounter: 1,
                receiptGlobalNo: 95,
                invoiceNo: "112212",
                buyerData: {
                    buyerRegisterName: "Shelly Whitaker",
                    buyerTradeName: "Ora Dale",
                    vatNumber: "963452312",
                    buyerTIN: "9634523128",
                    buyerContacts: {
                        phoneNo: "+1 (406) 268-1126",
                        email: "qysac@mailinator.com",
                    },
                    buyerAddress: {
                        province: "Omnis tenetur rem do",
                        city: "Tempor veniam quis",
                        street: "Et tempora commodi u",
                        houseNo: "Laboriosam porro ex",
                        district: "Fugiat architecto il",
                    },
                },
                receiptDate: "2024-11-13T18:30",
                receiptLinesTaxInclusive: false,
                receiptNotes: "Illo aliquam commodi",
                receiptLines: [
                    {
                        receiptLineType: "1",
                        receiptLineNo: 1,
                        receiptLineHSCode: "1111",
                        receiptLineName: "Barry Floyd",
                        receiptLinePrice: 200,
                        receiptLineQuantity: 1,
                        receiptLineTotal: 200,
                        taxPercent: 0,
                        taxCode: "a",
                        taxID: 2,
                    },
                ],
                receiptTaxes: [
                    {
                        taxCode: "a",
                        taxID: 2,
                        taxPercent: 0,
                        taxAmount: 0,
                        salesAmountWithTax: 200,
                    },
                ],
                receiptPayments: [
                    {
                        moneyTypeCode: "Cash",
                        paymentAmount: 200,
                    },
                ],
                receiptTotal: 200,
                receiptDeviceSignature: {
                    hash: "9e1fba3e1b484bb894588a07fefa84e9",
                    signature: "ExampleSignature==",
                },
            },
        };

        // Transform payload into receipt data
        const transformedData = transformPayloadToReceipt(payload);
        setReceiptData(transformedData);

        // Generate QR Code
        QRCode.toDataURL(`Invoice No: ${payload.receipt.invoiceNo}`, { errorCorrectionLevel: 'H' })
            .then((url) => {
                setQrCodeBase64(url);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    const generatePDF = () => {
        if (!receiptData) return;

        const doc = new jsPDF();

        // Add QR Code
        if (qrCodeBase64) {
            doc.addImage(qrCodeBase64, 'PNG', 150, 10, 40, 40);
        }

        // Add Buyer and Seller Information
        doc.text(`Seller Name: ${receiptData.seller.name}`, 20, 30);
        doc.text(`Buyer Name: ${receiptData.buyer.name}`, 20, 50);

        // Add Items
        const startY = 70;
        const lineHeight = 10;
        receiptData.items.forEach((item, index) => {
            const yPosition = startY + index * lineHeight;
            doc.text(item.description, 20, yPosition);
            doc.text(item.price.toFixed(2), 120, yPosition, { align: "right" });
        });

        // Add Totals
        const totalY = startY + receiptData.items.length * lineHeight;
        doc.text(`Total Amount: ${receiptData.totalAmount.toFixed(2)}`, 20, totalY);
        doc.text(`Total VAT: ${receiptData.totalVat.toFixed(2)}`, 20, totalY + 10);

        doc.save('invoice.pdf');
    };

    if (!receiptData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Card className="p-6">
                {error && <p className="text-red-500">{error}</p>}
                <Button onClick={generatePDF}>Download PDF</Button>

                <div>
                    <h2>Seller Information</h2>
                    <p>{receiptData.seller.name}</p>
                    <p>{receiptData.seller.address}</p>

                    <h2>Buyer Information</h2>
                    <p>{receiptData.buyer.name}</p>
                    <p>{receiptData.buyer.address}</p>
                </div>
            </Card>
        </div>
    );
};

export default InvoicePage;
