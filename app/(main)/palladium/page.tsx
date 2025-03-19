"use client";

import { useEffect } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";

export default function InvoicesPage() {
  const { invoices, fetchInvoices } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <div className="container mx-auto p-6 h-100px mt-12">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      {invoices.length === 0 ? (
        <p>Loading invoices...</p>
      ) : (
        <div className="space-y-6">
          {invoices.map((invoice) => (
            <div key={invoice.invoiceID} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold">
                Invoice ID: {invoice.invoiceID} | Customer: {invoice.customer}
              </h2>
              <p className="text-sm text-gray-600">Date: {new Date(invoice.date).toLocaleDateString()}</p>
              <p className="font-medium">Total: ${invoice.total.toFixed(2)}</p>
              <hr className="my-2" />
              <div className="pl-4">
                <h3 className="text-md font-semibold">Items</h3>
                {invoice.items.map((item) => (
                  <div key={`${invoice.invoiceID}-${item.lineNo}`} className="border-b py-2">
                    <p className="text-sm font-medium">
                      {item.partNumber} - {item.description}
                    </p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <p className="text-sm">Price Each: ${item.priceEach.toFixed(2)}</p>
                    <p className="text-sm">Total Line Amount: ${item.totalLineAmount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
