'use client';
import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import ItemTable from './_components/item-table';
import QRCode from 'qrcode'; // Import QRCode

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

// Sample receipt data
const receiptData: Receipt = {
    seller: {
        name: "Company ABC, Ltd.",
        tin: "1234567890",
        address: "12 Southgate Hwange, Downtown, Harare",
        email: "zimra@email.com",
        phone: "(0242) 758 891-5",
    },
    buyer: {
        name: "Food Market ABC",
        tin: "19870123",
        address: "ZB Centre Cnr Nkwame Nkrumah Ave/ First Street, Harare",
        email: "john.smith@email.com",
        phone: "(081) 20875",
    },
    invoiceNo: "15/451",
    date: "2023-07-03T18:48:00Z",
    deviceSerialNo: "12345678901234567890",
    fiscalDayNo: 45,
    items: [
        { code: "12345678", description: "Item1 name", quantity: 1, price: 313200.00, vat: 1721.74 },
        { code: "11223344", description: "Item2 name", quantity: 1, price: 5000.00, vat: 1956.52 },
    ],
    totalAmount: 33120.00,
    totalVat: 3678.26,
};

const InvoicePage = () => {
    const [logoBase64, setLogoBase64] = useState<string | null>(null);
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Convert image from public folder to base64
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await fetch('/logo.png'); // Adjust the path as needed
                if (!response.ok) {
                    throw new Error('Could not fetch the logo image. Status: ' + response.status);
                }
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoBase64(reader.result as string);
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            }
        };

        fetchLogo();

        QRCode.toDataURL(`Invoice No: ${receiptData.invoiceNo}`, { errorCorrectionLevel: 'H' })
            .then((url: any) => {
                setQrCodeBase64(url);
            })
            .catch((err: any) => {
                console.error(err);
            });
    }, []);

    // Function to generate and download PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Add logo (if loaded)
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 20, 10, 50, 20); // Adjust dimensions as needed
        }

        if (qrCodeBase64) {
            doc.addImage(qrCodeBase64, 'PNG', 150, 10, 40, 40); // Adjust dimensions as needed
        }


        // Title (below logo and QR code)
        doc.setFontSize(12);
        doc.text("FISCAL TAX INVOICE", 20, 50);

        // Seller and Buyer Information Side by Side
        doc.setFontSize(8);
        doc.text("SELLER", 20, 70);
        doc.text(`Name: ${receiptData.seller.name}`, 20, 80);
        doc.text(`TIN: ${receiptData.seller.tin}`, 20, 90);
        doc.text(`Address: ${receiptData.seller.address}`, 20, 100);
        doc.text(`Email: ${receiptData.seller.email}`, 20, 110);
        doc.text(`Phone: ${receiptData.seller.phone}`, 20, 120);

        // Buyer on the right side
        const buyerX = 110;
        doc.text("BUYER", buyerX, 70);
        doc.text(`Name: ${receiptData.buyer.name}`, buyerX, 80);
        doc.text(`TIN: ${receiptData.buyer.tin}`, buyerX, 90);
        doc.text(`Address: ${receiptData.buyer.address}`, buyerX, 100);
        doc.text(`Email: ${receiptData.buyer.email}`, buyerX, 110);
        doc.text(`Phone: ${receiptData.buyer.phone}`, buyerX, 120);

        // Separator
        doc.line(20, 130, 190, 130);

        // Invoice and Fiscal Details Side by Side
        doc.text(`Invoice No: ${receiptData.invoiceNo}`, 20, 140);
        doc.text(`Customer reference No: ${receiptData.buyer.tin}`, 20, 150);
        doc.text(`Device Serial No: ${receiptData.deviceSerialNo}`, 20, 160);

        doc.text(`Fiscal Day No: ${receiptData.fiscalDayNo}`, buyerX, 140);
        doc.text(`Date: ${new Date(receiptData.date).toLocaleString()}`, buyerX, 150);
        doc.text(`Fiscal device ID: ${receiptData.deviceSerialNo}`, buyerX, 160);

        // Separator
        doc.line(20, 170, 190, 170);

        // Table Header
        doc.text("Code", 20, 180);
        doc.text("Description", 60, 180);
        doc.text("Qty", 120, 180);
        doc.text("Price", 140, 180);
        doc.text("VAT", 160, 180);

        // Table Rows
        const startY = 190;
        const lineHeight = 10;

        receiptData.items.forEach((item, index) => {
            const yPosition = startY + index * lineHeight;
            doc.text(`${item.code}`, 20, yPosition);
            doc.text(`${item.description}`, 60, yPosition);
            doc.text(`${item.quantity}`, 120, yPosition);
            doc.text(`${item.price.toFixed(2)}`, 140, yPosition);
            doc.text(`${item.vat.toFixed(2)}`, 160, yPosition);
        });

        // Total Amounts
        const totalY = startY + receiptData.items.length * lineHeight + 10;
        doc.text(`Total Amount (incl. VAT): ${receiptData.totalAmount.toFixed(2)}`, 20, totalY);
        doc.text(`Total VAT: ${receiptData.totalVat.toFixed(2)}`, 20, totalY + 10);

        // Save the PDF
        doc.save('invoice-with-logo.pdf');
    };

    // Function to print the invoice
    const printInvoice = () => {
        window.print();
    };

    return (
        <div>
            <Card className="p-6">
                {error && <p className="text-red-500">{error}</p>}
                <Button onClick={generatePDF} disabled={!logoBase64}>
                    Download PDF
                </Button>
                <Button onClick={printInvoice}>Print Invoice</Button>

                {/* HTML layout preview */}
                <div className='flex items-center justify-between my-4'>
                    {/* Seller Information */}
                    <div className="mr-4">
                        <p>SELLER</p>
                        <p>Name: {receiptData.seller.name}</p>
                        <p>TIN: {receiptData.seller.tin}</p>
                        <p>Address: {receiptData.seller.address}</p>
                        <p>Email: {receiptData.seller.email}</p>
                        <p>Phone: {receiptData.seller.phone}</p>
                    </div>

                    {/* Buyer Information */}
                    <div>
                        <p>BUYER</p>
                        <p>Name: {receiptData.buyer.name}</p>
                        <p>TIN: {receiptData.buyer.tin}</p>
                        <p>Address: {receiptData.buyer.address}</p>
                        <p>Email: {receiptData.buyer.email}</p>
                        <p>Phone: {receiptData.buyer.phone}</p>
                    </div>
                </div>
                <Separator />
                <div className="my-4 flex items-center justify-between">
                    <div>
                        <p>Invoice No: {receiptData.invoiceNo}</p>
                        <p>Customer reference No: {receiptData.buyer.tin}</p>
                        <p>Device Serial No: {receiptData.deviceSerialNo}</p>
                    </div>
                    <div>
                        <p>Fiscal Day No: {receiptData.fiscalDayNo}</p>
                        <p>Date: {new Date(receiptData.date).toLocaleString()}</p>
                        <p>Fiscal device ID: {receiptData.deviceSerialNo}</p>
                    </div>
                </div>
                <Separator />
                <div>
                    <ItemTable items={receiptData.items} totalAmount={receiptData.totalAmount} totalVat={receiptData.totalVat} />
                </div>
            </Card>
        </div>
    );
};

export default InvoicePage;
