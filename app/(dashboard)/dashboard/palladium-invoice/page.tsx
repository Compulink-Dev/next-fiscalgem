'use client';

import { useState } from 'react';

export default function FetchInvoices() {
    const [invoices, setInvoices] = useState<any[]>([]);

    const fetchInvoices = async () => {
        const res = await fetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate: '2024-01-01', endDate: '2024-12-31' }),
        });

        if (res.ok) {
            const data = await res.json();
            setInvoices(data);
        } else {
            console.error('Failed to fetch invoices');
        }
    };

    return (
        <div>
            <button onClick={fetchInvoices}>Fetch Invoices</button>
            <pre>{JSON.stringify(invoices, null, 2)}</pre>
        </div>
    );
}
