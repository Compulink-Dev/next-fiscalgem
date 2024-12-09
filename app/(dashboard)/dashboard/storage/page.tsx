'use client';

import Subtitle from '@/app/_components/Subtitle';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../_components/Table';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../_components/Dialog';

interface Receipt {
    _id: string;
    receiptType: string;
    invoiceNo: string;
    receiptDate: string;
    receiptTotal: number;
    buyerData: {
        buyerRegisterName: string;
    };
    receiptLines: Array<{
        receiptLineNo: number;
        receiptLineName: string;
        receiptLinePrice: number;
        receiptLineQuantity: number;
        receiptLineTotal: number;
    }>;
    createdAt: string;
}

function Storage() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Calculate pagination values
    const totalPages = Math.ceil(receipts.length / rowsPerPage);
    const startRow = (currentPage - 1) * rowsPerPage;
    const currentRows = receipts.slice(startRow, startRow + rowsPerPage);

    useEffect(() => {
        // Fetch data from the backend
        const fetchReceipts = async () => {
            try {
                const response = await fetch('/api/storage');
                const data = await response.json();

                if (data.success) {
                    setReceipts(data.data);
                } else {
                    setError('Failed to fetch receipts.');
                }
            } catch (err) {
                console.error('Error fetching receipts:', err);
                setError('An error occurred while fetching receipts.');
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-green-800">
                <Loader className="animate-spin" size={32} />
                <p className="ml-4">Loading receipts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center mt-8">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Subtitle name="Storage" />
            <Separator className="my-4 bg-green-700" />

            {receipts.length > 0 ? (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Invoice No</TableCell>
                                <TableCell>Receipt Type</TableCell>
                                <TableCell>Buyer Name</TableCell>
                                <TableCell>Receipt Date</TableCell>
                                <TableCell>Receipt Total</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRows.map((receipt) => (
                                <TableRow key={receipt._id}>
                                    <TableCell>{receipt.invoiceNo}</TableCell>
                                    <TableCell>{receipt.receiptType}</TableCell>
                                    <TableCell>{receipt.buyerData.buyerRegisterName || 'N/A'}</TableCell>
                                    <TableCell>
                                        {new Date(receipt.receiptDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>${receipt.receiptTotal.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedReceipt(receipt)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4 text-sm">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <p className='text-xs'>
                            Page {currentPage} of {totalPages}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>

                    {selectedReceipt && (
                        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Invoice Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 text-xs">
                                    <p>
                                        <strong>Invoice No:</strong> {selectedReceipt.invoiceNo}
                                    </p>
                                    <p>
                                        <strong>Receipt Type:</strong> {selectedReceipt.receiptType}
                                    </p>
                                    <p>
                                        <strong>Buyer Name:</strong>{' '}
                                        {selectedReceipt.buyerData.buyerRegisterName || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Receipt Date:</strong>{' '}
                                        {new Date(selectedReceipt.receiptDate).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Receipt Total:</strong> ${selectedReceipt.receiptTotal.toFixed(2)}
                                    </p>

                                    <Separator className="bg-gray-200 my-4" />

                                    <h3 className="font-bold ">Line Items</h3>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedReceipt.receiptLines.map((line) => (
                                                <TableRow key={line.receiptLineNo}>
                                                    <TableCell>{line.receiptLineNo}</TableCell>
                                                    <TableCell>{line.receiptLineName}</TableCell>
                                                    <TableCell>${line.receiptLinePrice.toFixed(2)}</TableCell>
                                                    <TableCell>{line.receiptLineQuantity}</TableCell>
                                                    <TableCell>${line.receiptLineTotal.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <DialogFooter>
                                    <Button className='bg-green-700 hover:bg-green' onClick={() => setSelectedReceipt(null)}>
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            ) : (
                <div className="text-center mt-8 text-gray-500">
                    <p>No receipts found.</p>
                </div>
            )}
        </div>
    );
}

export default Storage;
