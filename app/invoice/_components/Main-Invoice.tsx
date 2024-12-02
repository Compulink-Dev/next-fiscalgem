'use client'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

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

const InvoiceForm: React.FC<{ data: Receipt }> = ({ data }) => {
    const { receipt } = data;
    const { receiptLines, receiptTaxes, receiptTotal } = receipt;

    return (
        <div className="max-w-5xl mx-auto p-6 text-sm font-sans">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="">
                    {/* <div className="border w-20 h-20 bg-gray-200 flex items-center justify-center text-center text-xs">
                        Taxpayer Logo
                    </div> */}
                    <Image src={'/logo.png'} alt="" width={130} height={125} className="w-full" />
                </div>

                {/* QR Code Section */}
                <div className=" text-right flex  gap-2 text-xs">
                    <div className="">
                        <p>Verification Code:</p>
                        <p className="font-bold">4C8B-E276-6333-0417</p>
                        <p className="mt-1">Verify at: <br /> <a href="https://receipt.zimra.org/" className="text-blue-500 underline">receipt.zimra.org</a></p>
                    </div>
                    <div className="border w-20 h-20 bg-gray-200 mt-2 mx-auto">
                        QR Code
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
                    <p>Company legal name</p>
                    <p>TIN: 1234567890</p>
                    <p>VAT No: 12345678</p>
                    <p>Address: Downtown location</p>
                    <p>Email: zimra@email.com</p>
                    <p>Phone: +263 (0) 8677105028</p>
                </div>

                {/* Buyer Info */}
                <div>
                    <h2 className="font-bold">BUYER</h2>
                    <p>Company ABC, Ltd.</p>
                    <p>Food Market ABC</p>
                    <p>TIN: 19870123</p>
                    <p>Email: john.smith@email.com</p>
                    <p>Phone: (081) 20875</p>
                    <p>Address: 12 Southgate Hwange</p>
                </div>
            </div>

            <Separator className="my-4 h-[1.5px] rounded bg-black" />

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="">
                    <p><strong>Invoice No:</strong> {receipt.invoiceNo}</p>
                    <p><strong>Customer reference No:</strong> {receipt.invoiceNo}</p>
                    <p><strong>Device Serial No:</strong> {data.deviceID}</p>
                </div>
                <div className="">
                    <p><strong>Fiscal Day No:</strong> {receipt.receiptCounter}</p>
                    <p><strong>Date:</strong> {new Date(receipt.receiptDate).toLocaleString()}</p>
                    <p><strong>Fiscal Device ID:</strong> {data.deviceID}</p>
                </div>
            </div>

            <Separator className="my-4 h-[1.5px] rounded bg-black" />

            <div className="text-center my-4">
                <h1 className="text-xl font-bold">CREDITED INVOICE</h1>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="">
                    <p><strong>Invoice No:</strong> {receipt.invoiceNo}</p>
                    <p><strong>Customer reference No:</strong> {receipt.invoiceNo}</p>
                    <p><strong>Device Serial No:</strong> {data.deviceID}</p>
                </div>
                <div className="">
                    <p><strong>Date:</strong> {new Date(receipt.receiptDate).toLocaleString()}</p>
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
                    {receiptLines.map((line, index) => (
                        <tr key={index} className="border">
                            <td className="border p-2 text-center">{line.receiptLineNo}</td>
                            <td className="border p-2">{line.receiptLineName}</td>
                            <td className="border p-2 text-center">{line.receiptLineQuantity}</td>
                            <td className="border p-2 text-right">{line.receiptLinePrice.toFixed(2)}</td>
                            <td className="border p-2 text-right">{line.taxPercent.toFixed(2)}%</td>
                            <td className="border p-2 text-right">{line.receiptLineTotal.toFixed(2)}</td>
                        </tr>
                    ))}
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
                    <p>Amount Excl TAX USD:</p>
                    <p className="">{receiptTaxes[0]?.taxAmount.toFixed(2) || "0.00"} USD</p>
                </div>
            </div>

            <div className="flex items-end justify-between gap-4 w-full">
                {/* Left Section for Goods Received */}
                <p className="flex-1 text-xs">Signature:</p>

                {/* Separator for Signature */}
                <div className="flex-1 border-b border-gray-500 h-12" />

                {/* Right Section for Amount */}
                <div className="flex-1 flex flex-row justify-between text-right gap-6">
                    <p className="">Total VAT: </p>
                    <p className="">{receiptTaxes[0]?.taxAmount.toFixed(2) || "0.00"} USD</p>
                </div>
            </div>

            <div className="flex items-end justify-between gap-4 w-full">
                {/* Left Section for Goods Received */}
                <p className="flex-1 text-xs"></p>

                {/* Separator for Signature */}
                . <div className="flex-1"></div>

                {/* Right Section for Amount */}
                <div className="flex-1 mt-4 font-bold flex flex-row items-center justify-between text-right gap-6">
                    <p className="text-xl ">Invoice Total: </p>
                    <p className="">{receiptTotal.toFixed(2)} {receipt.receiptCurrency}</p>
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
                <Button className="no-print" onClick={() => window.print()}>
                    Print
                </Button>
            </div>

        </div>
    );
};

export default InvoiceForm;