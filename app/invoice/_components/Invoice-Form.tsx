import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import QRCode from "react-qr-code";
import React from "react";
import { Button } from "@/components/ui/button";

type Receipt = {
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
};

type InvoiceProps = {
    data: Receipt | any;
    qrUrl: string | null;
};

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



const Invoice: React.FC<InvoiceProps> = ({ data, qrUrl }) => {
    const receipt = data?.receipt;
    console.log("Parent Component Data: ", data);

    console.log('Receipt Data : ', receipt);


    // If no receipt is present, render an error message
    if (!receipt) {
        console.error("Receipt data is missing:", data);
        return <div className="text-red-500">Error: Receipt data is unavailable.</div>;
    }

    const { buyerData, receiptLines, receiptTotal } = receipt;

    // Safely handle `receiptLines` and `receiptTaxes`
    const safeReceiptLines = Array.isArray(receiptLines) ? receiptLines : [];
    // const safeReceiptTaxes = Array.isArray(receiptTaxes) ? receiptTaxes : [];


    const totalPercentage = receiptTotal.toFixed(2) / (115 / 15)
    console.log('Percentage : ', totalPercentage);

    const totalTaxes = receiptTotal.toFixed(2) - totalPercentage


    return (
        <div className="max-w-5xl mx-auto border p-6 text-sm font-sans">
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
                <h1 className="text-xl font-bold">FISCAL TAX INVOICE</h1>
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
                    <p>{buyerData?.buyerRegisterName || "N/A"}</p>
                    <p>TIN: {buyerData?.buyerTIN || "N/A"}</p>
                    {/* <p>{buyerData?.buyerTradeName || "N/A"}</p> */}
                    <p>Email: {buyerData?.buyerContacts?.email || "N/A"}</p>
                    <p>Phone: {buyerData?.buyerContacts?.phoneNo || "N/A"}</p>
                    <p>
                        Address:{" "}
                        {`${buyerData?.buyerAddress?.street || ""}, ${buyerData?.buyerAddress?.city || ""}`}
                    </p>
                </div>
            </div>

            <Separator className="my-4 h-[1.5px] rounded bg-black" />

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                    <p><strong>Invoice No:</strong> {receipt.invoiceNo}</p>
                    <p><strong>Customer reference No:</strong> {receipt.invoiceNo}</p>
                    <p><strong>Device Serial No:</strong> {data.deviceID}</p>
                </div>
                <div>
                    <p><strong>Fiscal Day No:</strong> {receipt.receiptCounter}</p>
                    <p><strong>Date:</strong> {new Date(receipt.receiptDate).toLocaleString()}</p>
                    <p><strong>Fiscal Device ID:</strong> {data.deviceID}</p>
                </div>
            </div>

            <Separator className="my-4 h-[1.5px] rounded bg-black" />

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
                        safeReceiptLines.map((line, index) => (
                            <tr key={index} className="border">
                                <td className="border p-2 text-center">{line.receiptLineHSCode}</td>
                                <td className="border p-2">{line.receiptLineName}</td>
                                <td className="border p-2 text-center">{line.receiptLineQuantity}</td>
                                <td className="border p-2 text-right">{line.receiptLinePrice.toFixed(2)}</td>
                                {/* <td className="border p-2 text-right">{line.taxPercent.toFixed(2)}%</td> */}
                                <td className="border p-2 text-right">{totalPercentage.toFixed(2)}</td>
                                <td className="border p-2 text-right">{line.receiptLineTotal.toFixed(2)}</td>
                            </tr>
                        ))
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
                    <p>Amount Excl TAX {receipt.receiptCurrency}:</p>
                    {/* <p>{safeReceiptTaxes[0]?.taxAmount.toFixed(2) || "0.00"} {receipt.receiptCurrency}</p> */}
                    <p>{totalTaxes.toFixed(2)} {receipt.receiptCurrency}</p>
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
                    <p>{totalPercentage.toFixed(2)} {receipt.receiptCurrency}</p>
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
                    <p>{receiptTotal.toFixed(2)} {receipt.receiptCurrency}</p>
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

            <div className="my-4">
                <Button className="no-print bg-green-700 hover:bg-green-500" onClick={() => window.print()}>
                    Print
                </Button>
            </div>
        </div>
    );
};

export default Invoice;
