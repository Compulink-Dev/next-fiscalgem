"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FiscalizePage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchInvoices = async () => {
        setLoading(true);
        const response = await fetch("/api/odoo-invoices");
        const data = await response.json();
        setInvoices(data.data);
        setLoading(false);
    };

    const fiscalizeInvoice = async (invoice: any) => {
        const response = await fetch("/api/fiscalize-invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoice }),
        });
        const result = await response.json();
        console.log(result);
    };

    return (
        <div>
            <button onClick={fetchInvoices} disabled={loading}>
                {loading ? "Fetching Invoices..." : "Fetch Invoices"}
            </button>
            <ul>
                {invoices.map((invoice) => (
                    <li key={invoice.id}>
                        {invoice.name} - ${invoice.amount_total}
                        <Button onClick={() => fiscalizeInvoice(invoice)}>Fiscalize</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
