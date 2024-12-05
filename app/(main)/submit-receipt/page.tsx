//@ts-nocheck
'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 10;

const SubmitReceiptPage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const submitReceipt = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Prepare payload without deviceID and fiscalDayNo if not needed
            const { ...restOfReceiptData } = receiptData;
            const payload = {
                ...restOfReceiptData, // This will exclude deviceID and fiscalDayNo from the payload
            };
            const response = await fetch('/api/submit-receipt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'DeviceModelName': process.env.DEVICE_MODEL_NAME || 'Server',
                    'DeviceModelVersion': process.env.DEVICE_MODEL_VERSION_NO || 'v1',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to submit receipt');

            setMessage('Receipt submitted successfully!');
        } catch (error) {
            setMessage('Error submitting receipt');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/get-receipt');
            if (!response.ok) {
                throw new Error('Failed to fetch receipts');
            }
            const data = await response.json();
            setReceipts(data);
        } catch (error) {
            console.error('Error fetching receipts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts(); // Fetch receipts when the component loads
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Calculate pagination data
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentReceipts = receipts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(receipts.length / ITEMS_PER_PAGE);
    const [receiptData] = useState({
        deviceID: "19034", // Ensure deviceID matches Postman example as a string
        fiscalDayNo: 1,
        receipt: {
            receiptType: "FiscalInvoice",
            receiptCurrency: "ZWG", // Update currency to match Postman example
            receiptCounter: 1,
            receiptGlobalNo: 2786,
            invoiceNo: "IN-000002786",
            buyerData: {
                buyerRegisterName: "Generation Health",
            },
            receiptDate: "2024-11-01T00:00:00",
            receiptLinesTaxInclusive: true,
            receiptLines: [
                {
                    receiptLineType: "Sale",
                    receiptLineNo: 1,
                    receiptLineName: "HP Laser Toner Cartridge Black-W2210A",
                    receiptLineQuantity: 3,
                    receiptLineTotal: 11745.54,
                    taxPercent: 0,
                    taxID: 2000003966
                },
                {
                    receiptLineType: "Sale",
                    receiptLineNo: 2,
                    receiptLineName: "HP #207A CYAN LASERJET TONER CARTRIGE FOR CLJPRO M255/M283",
                    receiptLineQuantity: 3,
                    receiptLineTotal: 13747.59,
                    taxPercent: 0,
                    taxID: 2000003966
                },
                {
                    receiptLineType: "Sale",
                    receiptLineNo: 3,
                    receiptLineName: "HP Laser Toner Cartridge Yellow-1250 pages",
                    receiptLineQuantity: 3,
                    receiptLineTotal: 13747.59,
                    taxPercent: 0,
                    taxID: 2000003966
                },
                {
                    receiptLineType: "Sale",
                    receiptLineNo: 4,
                    receiptLineName: "HP #207A MAGENTA LASERJET TONER CARTRIGE FOR CLJPRO M255/M283",
                    receiptLineQuantity: 3,
                    receiptLineTotal: 13747.59,
                    taxPercent: 0,
                    taxID: 2000003966
                }
            ],
            receiptTaxes: [
                {
                    taxPercent: 0,
                    taxID: 2000003966,
                    taxAmount: 0,
                    salesAmountWithTax: 13747.59
                },
                {
                    taxPercent: 0,
                    taxID: 2000003966,
                    taxAmount: 0,
                    salesAmountWithTax: 13747.59
                },
                {
                    taxPercent: 0,
                    taxID: 2000003966,
                    taxAmount: 0,
                    salesAmountWithTax: 13747.59
                },
                {
                    taxPercent: 0,
                    taxID: 2000003966,
                    taxAmount: 0,
                    salesAmountWithTax: 11745.54
                }
            ],
            receiptPayments: [
                {
                    moneyTypeCode: "Cash",
                    paymentAmount: 52988.31
                }
            ],
            receiptTotal: 52988.31,
            receiptDeviceSignature: {
                hash: "YWJjMTIzCg==",
                signature: "signatureContent"
            }
        }
    });

    return (
        <div className="p-8 text-green-700">
            <Button
                variant={'outline'}
                className="px-4 py-2 border rounded-lg hover:text-gray-500"
                onClick={submitReceipt}
            >
                Submit Receipt
            </Button>

            {message && <p className="mt-4 text-green-700 font-bold">{message}</p>}

            <div className="mt-8">
                <h2 className="text-lg font-semibold">Receipts</h2>
                {loading ? (
                    <p>Loading receipts...</p>
                ) : (
                    <div>
                        <table className="min-w-full border-collapse border border-gray-200 mt-4">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 px-4 py-2">Device ID</th>
                                    <th className="border border-gray-200 px-4 py-2">Fiscal Day No</th>
                                    <th className="border border-gray-200 px-4 py-2">Receipt Counter</th>
                                    <th className="border border-gray-200 px-4 py-2">Global No</th>
                                    <th className="border border-gray-200 px-4 py-2">Total Amount</th>
                                    <th className="border border-gray-200 px-4 py-2">Date</th>
                                    <th className="border border-gray-200 px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReceipts.map((receipt, index) => (
                                    <tr key={index} className="hover:bg-gray-100 text-sm">
                                        <td className="border border-gray-200 px-4 py-2">{receipt.deviceID}</td>
                                        <td className="border border-gray-200 px-4 py-2">{receipt.fiscalDayNo}</td>
                                        <td className="border border-gray-200 px-4 py-2">{receipt.receiptCounter}</td>
                                        <td className="border border-gray-200 px-4 py-2">{receipt.receiptGlobalNo}</td>
                                        <td className="border border-gray-200 px-4 py-2">{receipt.totalAmount}</td>
                                        <td className="border border-gray-200 px-4 py-2">{new Date(receipt.createdAt).toLocaleString()}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-gray-500">{receipt.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination controls */}
                        <div className="flex justify-center items-center mt-4 space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmitReceiptPage;
