"use client";

import Subtitle from "@/app/_components/Subtitle";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
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

// Define Receipt interface
interface Receipt {
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

// Define Table Columns
const columns = (
  setSelectedReceipt: (receipt: Receipt | null) => void
): ColumnDef<Receipt>[] => [
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
    header: "Receipt Date",
    cell: ({ row }) => new Date(row.original.receiptDate).toLocaleDateString(),
  },
  {
    accessorKey: "receiptTotal",
    header: "Receipt Total",
    cell: ({ row }) => `$${row.original.receiptTotal.toFixed(2)}`,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedReceipt(row.original)}
      >
        View Details
      </Button>
    ),
  },
];

function Storage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch("/api/storage");
        const data = await response.json();

        if (data.success) {
          setReceipts(data.data);
        } else {
          setError("Failed to fetch receipts.");
        }
      } catch (err) {
        console.error("Error fetching receipts:", err);
        setError("An error occurred while fetching receipts.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
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
      <Subtitle name="Storage" />
      <Separator className="my-4 bg-green-700" />

      <DataTable
        columns={columns(setSelectedReceipt)}
        data={receipts}
        filter="receiptTotal"
        onRowSelectionChange={(selectedRows) => {
          console.log("Selected Rows:", selectedRows); // Handle row selection if necessary
        }}
      />

      {/* Dialog for Viewing Invoice Details */}
      {selectedReceipt && (
        <Dialog
          open={!!selectedReceipt}
          onOpenChange={() => setSelectedReceipt(null)}
        >
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
                <strong>Buyer Name:</strong>{" "}
                {selectedReceipt.buyerData.buyerRegisterName || "N/A"}
              </p>
              <p>
                <strong>Receipt Date:</strong>{" "}
                {new Date(selectedReceipt.receiptDate).toLocaleString()}
              </p>
              <p>
                <strong>Receipt Total:</strong> $
                {selectedReceipt.receiptTotal.toFixed(2)}
              </p>

              <Separator className="bg-gray-200 my-4" />

              <h3 className="font-bold">Line Items</h3>
              <Table>
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
              <Button
                className="bg-green-700 hover:bg-green"
                onClick={() => setSelectedReceipt(null)}
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

export default Storage;
