'use client';

import Subtitle from '@/app/_components/Subtitle';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../_components/Table';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../_components/Dialog';


interface Invoice {
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

function Saved() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Pagination calculations
    const totalPages = Math.ceil(invoices.length / rowsPerPage);
    const startRow = (currentPage - 1) * rowsPerPage;
    const currentRows = invoices.slice(startRow, startRow + rowsPerPage);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('/api/saved-invoices');
                const data = await response.json();

                if (data.success) {
                    setInvoices(data.data);
                } else {
                    setError('Failed to fetch saved invoices.');
                }
            } catch (err) {
                console.error('Error fetching invoices:', err);
                setError('An error occurred while fetching invoices.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin" size={32} />
                <p className="ml-4">Loading invoices...</p>
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
            <Subtitle name="Saved Invoices" />
            <Separator className="my-4 bg-green-700" />

            {invoices.length > 0 ? (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Invoice No</TableCell>
                                <TableCell>Receipt Type</TableCell>
                                <TableCell>Buyer Name</TableCell>
                                <TableCell>Invoice Date</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRows.map((invoice) => (
                                <TableRow key={invoice._id}>
                                    <TableCell>{invoice.invoiceNo || 'N/A'}</TableCell>
                                    <TableCell>{invoice.receiptType}</TableCell>
                                    <TableCell>{invoice.buyerData.buyerRegisterName || 'N/A'}</TableCell>
                                    <TableCell>
                                        {invoice.receiptDate
                                            ? new Date(invoice.receiptDate).toLocaleDateString()
                                            : 'Invalid Date'}
                                    </TableCell>
                                    <TableCell>${invoice.receiptTotal?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedInvoice(invoice);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
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

                    {/* Modal for Invoice Details */}
                    {selectedInvoice && (
                        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Invoice Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 text-xs">
                                    <p>
                                        <strong>Invoice No:</strong> {selectedInvoice.invoiceNo}
                                    </p>
                                    <p>
                                        <strong>Receipt Type:</strong> {selectedInvoice.receiptType}
                                    </p>
                                    <p>
                                        <strong>Buyer Name:</strong>{' '}
                                        {selectedInvoice.buyerData.buyerRegisterName || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Receipt Date:</strong>{' '}
                                        {new Date(selectedInvoice.receiptDate).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Receipt Total:</strong> ${selectedInvoice.receiptTotal.toFixed(2)}
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
                                            {selectedInvoice.receiptLines.map((line) => (
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
                                    <Button className='bg-green-700 hover:bg-green' onClick={() => setSelectedInvoice(null)}>
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    )}
                </>
            ) : (
                <div className="text-center mt-8 text-gray-500">
                    <p>No saved invoices found.</p>
                </div>
            )}
        </div>
    );
}

export default Saved;
