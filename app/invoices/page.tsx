'use client'
// components/Invoice.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type BankDetail = {
    name: string;
    bank: string;
    branch: string;
    code: string;
    accountNumber: string;
    swiftCode: string;
};

const bankDetails: BankDetail[] = [
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

type BankDetailsProps = {
    detail: BankDetail;
};

const BankDetails: React.FC<BankDetailsProps> = ({ detail }) => {
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

type ReceiptData = {
    buyerData: {
        buyerRegisterName: string;
        buyerTradeName: string | null;
        buyerTIN: string | null;
        buyerContacts: {
            email: string | null;
            phoneNo: string | null;
        };
        buyerAddress: {
            street: string;
            city: string;
        };
    };
    invoiceNo: string;
    receiptDate: string;
    receiptCounter: string;
    receiptLines: {
        receiptLineNo: string;
        receiptLineHSCode: string;
        receiptLineName: string;
        receiptLineQuantity: number;
        receiptLinePrice: number;
        taxPercent: number;
        receiptLineTotal: number;
    }[];
    receiptTotal: number;
    receiptCurrency: string;
    receiptTaxes: {
        taxAmount: string;
    }[];
};


const PDFInvoice: React.FC = ({ data, onBack }: any) => {
    const { receipt } = data;

    const parseDate = (dateString: string): Date => {
        const [day, month, year] = dateString?.split('/');
        return new Date(`${year}-${month}-${day}`); ''
    };

    const router = useRouter()


    const { buyerData, receiptLines, receiptTotal } = receipt;

    const safeReceiptLines = Array.isArray(receiptLines) ? receiptLines : [];

    // Calculate the total taxes for all lines by iterating through each line
    const totalTaxes = safeReceiptLines.reduce((sum, line) => {
        const lineTax = (line.receiptLinePrice * line.receiptLineQuantity) * line.taxPercent / (100 + line.taxPercent);
        return sum + lineTax;
    }, 0);

    const amountExclTax = receiptTotal - totalTaxes;


    return (
        <div className="w-full mx-auto my-0 px-6 pt-0 text-sm font-sans">
            <div className="flex justify-between items-center">
                <Image src={'/logo.png'} alt="" width={130} height={80} className="" />
                <div className="text-right flex gap-2 text-xs">
                    <div>
                        <p>Verification Code:</p>
                        <p className="font-bold">4C8B-E276-6333-0417</p>
                        <p className="mt-1">Verify at: <br /> <a href="https://receipt.zimra.org/" className="text-blue-500 underline">receipt.zimra.org</a></p>
                    </div>
                    <div className="border w-20 h-20 bg-gray-200 mt-2 mx-auto">
                        QR Code
                    </div>
                </div>
            </div>

            <div className="text-center my-2">
                <h1 className="text-xl font-bold">FISCAL TAX INVOICE</h1>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-2">
                <div>
                    <h2 className="font-bold">SELLER</h2>
                    <p>Company legal name</p>
                    <p>TIN: 1234567890</p>
                    <p>VAT No: 12345678</p>
                    <p>Address: Downtown location</p>
                    <p>Email: zimra@email.com</p>
                    <p>Phone: +263 (0) 8677105028</p>
                </div>

                <div>
                    <h2 className="font-bold">BUYER</h2>
                    <p>{receipt?.buyerData?.buyerRegisterName}</p>
                    <p>{receipt?.buyerData?.buyerTradeName || "N/A"}</p>
                    <p>TIN: {receipt?.buyerData?.buyerTIN || "N/A"}</p>
                    <p>Email: {receipt?.buyerData?.buyerContacts.email || "N/A"}</p>
                    <p>Phone: {receipt?.buyerData?.buyerContacts.phoneNo || "N/A"}</p>
                    <p>Address: {receipt?.buyerData?.buyerAddress.street}, {receipt?.buyerData?.buyerAddress.city}</p>
                </div>
            </div>

            <div className="my-4 h-[1.5px] rounded bg-black" />

            <div className="grid grid-cols-2 gap-6 mt-2">
                <div>
                    <p><strong>Invoice No:</strong> {receipt?.invoiceNo}</p>
                    <p><strong>Date:</strong> {parseDate(receipt?.receiptDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p><strong>Fiscal Day No:</strong> {receipt?.receiptCounter}</p>
                    <p><strong>Fiscal Device ID:</strong> {data?.deviceID}</p>
                </div>
            </div>

            <div className="my-2 h-[1.5px] rounded bg-black" />

            <table className="w-full mt-2 border border-collapse text-sm">
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
                    {receipt?.receiptLines.map((line: any) => (
                        <tr key={line.receiptLineNo} className="border">
                            <td className="border p-2 text-center">{line?.receiptLineHSCode}</td>
                            <td className="border p-2">{line?.receiptLineName}</td>
                            <td className="border p-2 text-center">{line?.receiptLineQuantity}</td>
                            <td className="border p-2 text-right">{line?.receiptLinePrice.toFixed(2)}</td>
                            <td className="border p-2 text-right">{line?.taxPercent}%</td>
                            <td className="border p-2 text-right">{line?.receiptLineTotal.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="my-2 h-[1.5px] rounded bg-black" />

            <div className="flex items-end justify-between gap-4 w-full">
                {/* Left Section for Goods Received */}
                <p className="flex-1 text-xs">Goods received in good condition by:</p>

                {/* Separator for Signature */}
                <div className="flex-1 border-b border-gray-500 h-12" />

                {/* Right Section for Amount */}
                <div className="flex-1 flex flex-row justify-between text-right gap-6">
                    <p>Amount Excl TAX {receipt.receiptCurrency}:</p>
                    {/* <p>{safeReceiptTaxes[0]?.taxAmount.toFixed(2) || "0.00"} {receipt.receiptCurrency}</p> */}
                    <p>{amountExclTax.toFixed(2)} {receipt.receiptCurrency}</p>
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
                    <p>{totalTaxes.toFixed(2)} {receipt.receiptCurrency}</p>
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

            <div className="flex items-center gap-2 my-4">
                <Button
                    className="bg-green-500 transition hover:bg-green-400 transform hover:scale-105"
                    onClick={() => window.print()}
                >
                    Print
                </Button>
                <Button
                    onClick={() => router.refresh()}
                    variant={'ghost'}

                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default PDFInvoice;
