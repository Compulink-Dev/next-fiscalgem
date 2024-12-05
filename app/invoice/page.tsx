'use client'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

// Define the structure of the receipt data
interface Payload {
    deviceID: number;
    receipt: {
        receiptType: string;
        receiptCurrency: string;
        receiptCounter: number;
        receiptGlobalNo: number;
        invoiceNo: string;
        buyerData: {
            buyerRegisterName: string;
            buyerTradeName: string;
            vatNumber: string;
            buyerTIN: string;
            buyerContacts: {
                phoneNo: string;
                email: string;
            };
            buyerAddress: {
                province: string;
                city: string;
                street: string;
                houseNo: string;
                district: string;
            };
        };
        receiptDate: string;
        receiptNotes: string;
        receiptLines: Array<{
            receiptLineHSCode: number,
            receiptLineNo: number;
            receiptLineName: string;
            receiptLinePrice: number;
            receiptLineQuantity: number;
            receiptLineTotal: number;
            taxPercent: number;
        }>;
        receiptTaxes: Array<{
            taxCode: string;
            taxAmount: number;
            salesAmountWithTax: number;
        }>;
        receiptTotal: number;
    };
}

interface ReceiptData {
    payload: Payload;
    qrUrl: string;
    signature: string;
    hash: string;
    md5Hash: string;
}

const bankDetails = [
    {
        name: "Compulink Systems PL",
        bank: "Nedbank USD Nostro",
        branch: "Jason Moyo Branch",
        code: "18100",
        accountNumber: "11990148688",
        swiftCode: "MBCAZWHX",
    },
    {
        name: "Compulink Systems PL",
        bank: "Nedbank ZWG",
        branch: "Jason Moyo Branch",
        code: "18100",
        accountNumber: "21038003951",
        swiftCode: "MBCAZWHX",
    },
    {
        name: "Compulink Systems PL",
        bank: "First Capital ZWG",
        branch: "Pearl house",
        code: "02144",
        accountNumber: "21571018489",
        swiftCode: "",
    },
    {
        name: "Compulink Systems PL",
        bank: "CABS ZWG",
        branch: "Chisipite",
        code: "10007",
        accountNumber: "1005890935",
        swiftCode: "CABSZWHAXXX",
    },
];

const BankDetails = ({ detail }: { detail: typeof bankDetails[0] }) => {
    return (
        <div className="text-xs">
            <p className="font-bold">{detail.name}</p>
            <p>{detail.bank}</p>
            <p>{detail.branch}</p>
            <p>{detail.code}</p>
            <p>{detail.accountNumber}</p>
            {detail.swiftCode && <p>{detail.swiftCode}</p>}
        </div>
    );
};


const Invoice = () => {
    // Type the state with ReceiptData or null
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const router = useRouter()

    useEffect(() => {
        // Retrieve data from localStorage
        const data = localStorage.getItem('receiptData');
        if (data) {
            setReceiptData(JSON.parse(data));
        } else {
            console.error('No receipt data found');
        }
    }, []);

    if (!receiptData) {
        return <div className='bg-green-900 h-screen w-screen flex flex-col items-center justify-center text-white'>
            <p className="">Receipt data is unavailable.</p>
            <Loader className='animate' />
        </div>;
    }

    const { payload, qrUrl } = receiptData;
    console.log("Payload :", payload.deviceID);

    const { buyerData, receiptLines, receiptTotal } = payload.receipt;

    const safeReceiptLines = Array.isArray(receiptLines) ? receiptLines : [];


    // Calculate the total taxes for all lines by iterating through each line
    const totalTaxes = safeReceiptLines.reduce((sum, line) => {
        const lineTax = (line.receiptLinePrice * line.receiptLineQuantity) * line.taxPercent / (100 + line.taxPercent);
        return sum + lineTax;
    }, 0);

    console.log('Total Taxes', totalTaxes);

    const amountExclTax = receiptTotal - totalTaxes;

    console.log('Amount Exc Tax', amountExclTax);

    // Your existing invoice rendering logic
    return (
        <div className="m-8 max-w-5xl mx-auto border p-6 text-sm font-sans">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="">
                    <Image src={"/logo.png"} alt="" width={130} height={125} className="w-full" />
                </div>

                {/* QR Code Section */}
                <div className="text-right flex gap-2 text-xs">
                    <div className="">
                        <p>Verification Code:</p>
                        <p className="font-bold">4C8B-E276-6333-0417</p>
                        <p className="mt-1">
                            Verify at: <br />
                            <a target="_blank" href={`${qrUrl}`} className="text-blue-500 underline">receipt.zimra.org</a>
                        </p>
                    </div>
                    <div className="border w-20 h-20 bg-gray-200 mt-2 mx-auto">
                        {qrUrl && <QRCode value={qrUrl} size={80} />}
                    </div>
                </div>
            </div>

            {/* Invoice Title */}
            <div className="text-center my-4">
                <h1 className="text-xl font-bold">
                    {payload.receipt.receiptType === "FISCALINVOICE" ? "FISCAL TAX INVOICE" :
                        payload.receipt.receiptType === "CREDITNOTE" ? "CREDIT NOTE" :
                            payload.receipt.receiptType === "DEBITNOTE" ? "DEBIT NOTE" :
                                payload.receipt.receiptType} {/* Default fallback if no match */}
                </h1>
            </div>

            {/* Seller and Buyer Information */}
            <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Seller Info */}
                <div>
                    <h2 className="font-bold">SELLER</h2>
                    <p>Compulink</p>
                    <p>TIN: 2000003966</p>
                    <p>VAT No: 220001836</p>
                    <p>Address: 313 Samora Machel</p>
                    <p>Email: accountsreceievable@compulink.co.zw</p>
                    <p>Phone: +263 (0) 8677105028</p>
                </div>

                {/* Buyer Info */}
                <div>
                    <h2 className="font-bold">BUYER</h2>
                    <p>{payload.receipt.buyerData?.buyerRegisterName || "N/A"}</p>
                    <p>TIN: {payload.receipt.buyerData?.buyerTIN || "N/A"}</p>
                    <p>VAT No: {payload.receipt.buyerData?.vatNumber || ""}</p>
                    <p>Email: {payload.receipt.buyerData?.buyerContacts?.email || ""}</p>
                    <p>Phone: {payload.receipt.buyerData?.buyerContacts?.phoneNo || ""}</p>
                    <p>
                        Address:{" "}
                        {`${payload.receipt.buyerData?.buyerAddress?.street || ""}, ${payload.receipt.buyerData?.buyerAddress?.city || ""}`}
                    </p>
                </div>
            </div>

            <Separator className="my-4 h-[1.5px] rounded bg-black" />


            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                    <p><strong>Invoice No:</strong> {payload.receipt.invoiceNo}</p>
                    <p><strong>Customer reference No:</strong> {payload.receipt.invoiceNo}</p>
                    <p><strong>Device Serial No:</strong> {payload.deviceID}</p>
                </div>
                <div>
                    <p><strong>Fiscal Day No:</strong> {payload.receipt.receiptGlobalNo}</p>
                    <p><strong>Date:</strong> {new Date(payload.receipt.receiptDate).toLocaleString()}</p>
                    <p><strong>Fiscal Device ID:</strong> {payload.deviceID}</p>
                </div>
            </div>
            <Separator className="my-4 h-[1.5px] rounded bg-black" />

            {(payload.receipt.receiptType === "CREDITNOTE" || payload.receipt.receiptType === "DEBITNOTE") && (
                <>
                    <div className="text-center my-4">
                        <h1 className="text-xl font-bold">
                            {payload.receipt.receiptType === "CREDITNOTE" ? "CREDIT NOTE" : "DEBIT NOTE"}
                        </h1>
                    </div>

                    {/* Credit/Debit Invoice Details */}
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div>
                            <p><strong>Invoice No:</strong> {payload.receipt.invoiceNo}</p>
                            <p><strong>Customer reference No:</strong> {payload.receipt.invoiceNo}</p>
                            <p><strong>Device Serial No:</strong> {payload.deviceID}</p>
                        </div>
                        <div>
                            <p><strong>Date:</strong> {new Date(payload.receipt.receiptDate).toLocaleString()}</p>
                        </div>
                    </div>

                    <Separator className="my-4 h-[1.5px] rounded bg-black" />
                </>
            )}

            {/* Line Items Table */}
            <table className="w-full mt-6 border border-collapse text-sm">
                <thead className="bg-gray-100 border">
                    <tr>
                        <th className="border p-2">Code</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Qty</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">VAT</th>
                        <th className="border p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {safeReceiptLines.length > 0 ? (
                        safeReceiptLines.map((line, index) => {
                            const lineTax = (line.receiptLinePrice * line.receiptLineQuantity) * line.taxPercent / (100 + line.taxPercent);

                            return (
                                <tr key={index} className="border">
                                    <td className="border p-2">{line.receiptLineHSCode}</td>
                                    <td className="border p-2">{line.receiptLineName}</td>
                                    <td className="border p-2 text-center">{line.receiptLineQuantity}</td>
                                    <td className="border p-2 text-right">{line.receiptLinePrice.toFixed(2)}</td>
                                    <td className="border p-2 text-right">
                                        {lineTax.toFixed(2)}
                                    </td>
                                    <td className="border p-2 text-right">{line.receiptLineTotal.toFixed(2)}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="border p-2 text-center text-gray-500">
                                No line items available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Separator className="my-4 h-[1.5px] rounded bg-black" />

            {/* Taxes and Totals */}

            <div className="flex items-end justify-between gap-4 w-full">
                {/* Left Section for Goods Received */}
                <p className="flex-1 text-xs">Goods received in good condition by:</p>

                {/* Separator for Signature */}
                <div className="flex-1 border-b border-gray-500 h-12" />

                {/* Right Section for Amount */}
                <div className="flex-1 flex flex-row justify-between text-right gap-6">
                    <p>Amount Excl TAX {payload.receipt.receiptCurrency}:</p>
                    {/* <p>{safeReceiptTaxes[0]?.taxAmount.toFixed(2) || "0.00"} {receipt.receiptCurrency}</p> */}
                    <p>{amountExclTax.toFixed(2)} {payload.receipt.receiptCurrency}</p>
                </div>
            </div>

            <div className="flex items-end justify-between gap-4 w-full">
                {/* Left Section for Goods Received */}
                <p className="flex-1 text-xs">Signature:</p>

                {/* Separator for Signature */}
                <div className="flex-1 border-b border-gray-500 h-12" />

                {/* Right Section for Amount */}
                <div className="flex-1 flex flex-row justify-between text-right gap-6">
                    <p>Total VAT:</p>
                    {/* <p>{safeReceiptTaxes[0]?.taxAmount.toFixed(2) || "0.00"} {receipt.receiptCurrency}</p> */}
                    <p>{totalTaxes.toFixed(2)} {payload.receipt.receiptCurrency}</p>
                </div>
            </div>


            <div className="flex items-end justify-between gap-4 w-full">
                {/* Left Section for Goods Received */}
                <p className="flex-1 text-xs"></p>

                {/* Separator for Signature */}
                . <div className="flex-1"></div>

                {/* Right Section for Amount */}
                <div className="flex-1 mt-4 font-bold flex flex-row items-center justify-between text-right gap-6">
                    <p className="font-bold">Invoice Total:</p>
                    <p>{receiptTotal.toFixed(2)} {payload.receipt.receiptCurrency}</p>
                </div>
            </div>



            {/* Footer Notes */}
            <div className="mt-6 text-xs">
                <p className="font-bold">Terms and conditions</p>
                <div className="border p-2">
                    <p> Goods remain Compulink Property until paid in full.</p>
                </div>
            </div>


            <div className="">
                <p className="font-bold text-xs mt-4">Bank Details</p>
                <div className="border p-2 grid grid-cols-4 gap-4">
                    {bankDetails.map((detail, index) => (
                        <BankDetails key={index} detail={detail} />
                    ))}
                </div>
            </div>

            <div className="my-4 flex gap-4">
                <Button className="no-print bg-green-700 hover:bg-green-500" onClick={() => window.print()}>
                    Print
                </Button>
                <Button variant={'outline'} onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default Invoice;
