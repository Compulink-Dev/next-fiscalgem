//@ts-nocheck
// components/DisplayTables.tsx
'use client';

import PDFInvoice from '@/app/_components/PDFInvoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';



// Type Definitions
interface ShipToData {
    name: string;
    street: string;
    city: string;
    province: string;
    houseNo: string;
    district: string;
}

interface ReceiptLine {
    receiptLineType: string;
    receiptLineNo: number;
    receiptLineHSCode: string;
    receiptLineName: string;
    receiptLinePrice: number;
    receiptLineQuantity: number;
    receiptLineTotal: number;
    taxPercent: number;
    taxCode: string;
    taxID: number;
    taxAmount: number;
}

interface Summary {
    "Invoice Total": string;
}

interface FinalJson {
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
                street: string;
                city: string;
                province: string;
                houseNo: string;
                district: string;
            };
        };
        receiptDate: string;
        receiptLinesTaxInclusive: boolean;
        receiptNotes: string;
        receiptLines: ReceiptLine[];
        receiptTaxes: Array<{
            taxCode: string;
            taxID: number;
            taxPercent: number;
            taxAmount: string;
            salesAmountWithTax: string;
        }>;
        receiptPayments: any[];
        receiptTotal: number;
        receiptDeviceSignature: {
            hash: string;
            signature: string;
        };
    };
}

export default function DisplayTables() {
    const [jsonData, setJsonData] = useState<FinalJson | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const file = (e.target as HTMLFormElement).file?.files[0];
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            setError('');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to upload and process file.');
            }

            const data = await res.json();

            if (data.success) {
                setJsonData(buildFinalJson(data)); // Set your JSON data
                toast.success('Invoice uploaded successfully!'); // Success toast
                setTimeout(() => {
                    // Store the JSON in localStorage
                    localStorage.setItem('invoiceData', JSON.stringify(data));

                    // Redirect to the invoices page
                    // router.push('/invoices');
                }, 2000); // Delay for a smoother transition
            } else {
                setError(data.error || 'Failed to extract tables from the uploaded PDF.');
                toast.error('Failed to extract tables from the uploaded PDF.')
            }
        } catch (e: any) {
            console.error('Error uploading file:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setJsonData(null); // Reset JSON data to show the upload form again
    };

    const buildFinalJson = (data: any): FinalJson => {
        const finalJson: FinalJson = {
            deviceID: 0,
            receipt: {
                receiptType: "",
                receiptCurrency: "",
                receiptCounter: 0,
                receiptGlobalNo: 0,
                invoiceNo: "",
                buyerData: {
                    buyerRegisterName: "",
                    buyerTradeName: "",
                    vatNumber: "",
                    buyerTIN: "",
                    buyerContacts: {
                        phoneNo: "",
                        email: ""
                    },
                    buyerAddress: {
                        street: "",
                        city: "",
                        province: "",
                        houseNo: "",
                        district: ""
                    }
                },
                receiptDate: "",
                receiptLinesTaxInclusive: false,
                receiptNotes: "",
                receiptLines: [],
                receiptTaxes: [],
                receiptPayments: [],
                receiptTotal: 0,
                receiptDeviceSignature: {
                    hash: "",
                    signature: ""
                }
            }
        };

        if (data.tables && data.tables.length > 0) {
            const table1Data = data.tables[0];
            const table2Data = data.tables[1];

            // Extract Invoice No and Date
            finalJson.receipt.invoiceNo = extractFromTable(table1Data, "Invoice No:");
            finalJson.receipt.receiptDate = extractFromTable(table1Data, "Date:");
            finalJson.receipt.receiptCurrency = extractFromTable(table1Data, "Currency");

            // Extract buyer data
            const shipToData = extractShipToData(table1Data);
            finalJson.receipt.buyerData.buyerRegisterName = shipToData.name || "";
            finalJson.receipt.buyerData.buyerAddress = {
                street: shipToData.street || "",
                city: shipToData.city || "",
                province: shipToData.province || "",
                houseNo: shipToData.houseNo || "",
                district: shipToData.district || ""
            };

            // Transform receipt lines
            const transformedTable = transformTable2Data(table2Data);
            finalJson.receipt.receiptLines = transformedTable.receiptLines;

            // Add tax amount to each line
            let totalTaxAmount = 0;
            finalJson.receipt.receiptLines.forEach((line) => {
                totalTaxAmount += line.taxAmount || 0; // Ensure tax amount is accounted for
            });

            // Add taxes summary
            finalJson.receipt.receiptTaxes.push({
                taxCode: "1",
                taxID: 3,
                taxPercent: 15, // Assuming default tax rate
                taxAmount: totalTaxAmount.toFixed(2),
                salesAmountWithTax: transformedTable.summary["Invoice Total"]
            });

            // Compute total
            finalJson.receipt.receiptTotal = parseFloat(transformedTable.summary["Invoice Total"]) || 0;
        }

        console.log("Final JSON Structure:", JSON.stringify(finalJson, null, 2));
        return finalJson;
    };

    const extractFromTable = (tableData: any[], key: string): string => {
        const row = tableData.find((row) => row[3]?.trim() === key);
        return row ? row[4]?.trim() : "";
    };

    const parseCurrency = (currencyValue: string | number): number => {
        if (typeof currencyValue === 'string') {
            return parseFloat(currencyValue.replace(/[^0-9.-]+/g, "")) || 0;
        }
        return Number(currencyValue) || 0;
    };

    const extractShipToData = (table: any[]): ShipToData => {
        const shipTo: ShipToData = {
            name: "",
            street: "",
            city: "",
            province: "Mashonaland Central", // Default province
            houseNo: "",
            district: "",
        };


        for (let i = 0; i < table.length; i++) {
            const row = table[i];

            if (row[2]?.trim() === "Ship To:") {
                shipTo.name = table[i + 2]?.[0]?.trim() || ""; // Row for name
                shipTo.street = table[i + 3]?.[0]?.trim() || ""; // Row for street
                shipTo.houseNo = table[i + 4]?.[0]?.trim() || ""; // Row for house number
                shipTo.city = table[i + 6]?.[0]?.trim() || ""; // Row for city
                shipTo.district = table[i + 8]?.[0]?.trim() || ""; // Row for district
                break;
            }
        }

        console.log("Extracted Ship To Data:", shipTo);
        return shipTo;
    };

    const transformTable2Data = (tableData: any[]): { receiptLines: ReceiptLine[], summary: Summary } => {
        const receiptLines: ReceiptLine[] = [];
        const summary: Summary = { "Invoice Total": "0" };

        for (let i = 3; i < tableData.length; i++) {
            const row = tableData[i];
            const itemCode = row[0]?.trim() || '';
            const description = row[1]?.trim() || '';
            const quantity = parseInt(row[2]?.trim() || '0', 10);
            const price = parseCurrency(row[3]?.trim() || '0');
            const taxAmount = parseCurrency(row[4]?.trim() || '0'); // Correctly extract tax
            const total = parseCurrency(row[5]?.trim() || '0');

            if (itemCode && description && !isNaN(quantity) && !isNaN(price) && !isNaN(total)) {
                receiptLines.push({
                    receiptLineType: "Sale",
                    receiptLineNo: receiptLines.length + 1,
                    receiptLineHSCode: itemCode,
                    receiptLineName: description,
                    receiptLinePrice: price,
                    receiptLineQuantity: quantity,
                    receiptLineTotal: total,
                    taxPercent: 15, // Assuming a default value
                    taxCode: "1",
                    taxID: 3,
                    taxAmount: taxAmount // Store tax amount in the line item
                });
            }
        }

        const invoiceTotal = receiptLines.reduce((total, line) => total + line.receiptLineTotal, 0);
        summary["Invoice Total"] = invoiceTotal.toFixed(2);

        return { receiptLines, summary };
    };

    return (
        <div className="w-full h-full p-4">

            {!jsonData ? (
                <form onSubmit={handleFileUpload} className='space-y-4'>
                    <Label className=''>Upload PDF File</Label>
                    <Input type="file" name="file" accept=".pdf" />
                    <Button className='bg-green-700 hover:bg-green-500' type="submit" disabled={loading}>{loading ? 'Processing...' : 'Upload PDF'}</Button>
                </form>
            ) : (
                <div>
                    {error && <div className="text-red-500">{error}</div>}
                    {jsonData && <PDFInvoice data={jsonData} />}
                    <Button onClick={handleBack}>Back</Button>
                </div>
            )}
        </div>
    );
}
