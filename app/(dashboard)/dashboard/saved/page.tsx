"use client";

import Subtitle from "@/app/_components/Subtitle";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { DataTable } from "@/components/DataTable"; // Adjust the import path as needed
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invoice {
  _id: string;
  receiptType: string;
  invoiceNo: string;
  receiptDate: string;
  receiptTotal: number;
  buyerData: {
    buyerRegisterName: string;
  };
  receiptLines: {
    receiptLineNo: number;
    receiptLineName: string;
    receiptLinePrice: number;
    receiptLineQuantity: number;
    receiptLineTotal: number;
  }[];
}

const columns = (
  setSelectedInvoice: (invoice: Invoice | null) => void
): ColumnDef<Invoice>[] => [
  {
    accessorKey: "invoiceNo",
    header: "Invoice No",
  },
  {
    accessorKey: "receiptType",
    header: "Receipt Type",
  },
  {
    accessorKey: "buyerData.buyerRegisterName",
    header: "Buyer Name",
    cell: ({ row }) => row.original.buyerData.buyerRegisterName || "N/A",
  },
  {
    accessorKey: "receiptDate",
    header: "Invoice Date",
    cell: ({ row }) => new Date(row.original.receiptDate).toLocaleDateString(),
  },
  {
    accessorKey: "receiptTotal",
    header: "Total Amount",
    cell: ({ row }) => `$${row.original.receiptTotal.toFixed(2)}`,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedInvoice(row.original)}
      >
        View Details
      </Button>
    ),
  },
];

function Saved() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/saved-invoices");
        const data = await response.json();
        if (data.success) {
          setInvoices(data.data);
        } else {
          setError("Failed to fetch saved invoices.");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("An error occurred while fetching invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2 items-center justify-center h-screen text-green-800">
        <Loader className="animate-spin" size={18} />
        <p className="text-sm">Loading receipts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-xs text-center mt-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Subtitle name="Saved Invoices" />
      <Separator className="my-4 bg-green-700" />

      <DataTable
        columns={columns(setSelectedInvoice)}
        data={invoices}
        filter="Invoice No"
      />

      {selectedInvoice && (
        <Dialog
          open={!!selectedInvoice}
          onOpenChange={() => setSelectedInvoice(null)}
        >
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
                <strong>Buyer Name:</strong>{" "}
                {selectedInvoice.buyerData.buyerRegisterName || "N/A"}
              </p>
              <p>
                <strong>Receipt Date:</strong>{" "}
                {new Date(selectedInvoice.receiptDate).toLocaleString()}
              </p>
              <p>
                <strong>Receipt Total:</strong> $
                {selectedInvoice.receiptTotal.toFixed(2)}
              </p>
              <Separator className="bg-gray-200 my-4" />
              <h3 className="font-bold">Line Items</h3>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.receiptLines.map((line) => (
                    <TableRow key={line.receiptLineNo} className="text-sm">
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
              <Button
                className="bg-green-700 hover:bg-green"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Saved;
