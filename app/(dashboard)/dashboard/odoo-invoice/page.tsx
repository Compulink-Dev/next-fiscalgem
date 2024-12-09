'use client';

import React, { useEffect, useState } from 'react';

const SavedInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch('/api/odoo');
                const data = await res.json();
                if (data.success) {
                    setInvoices(data.data);
                } else {
                    setError(data.error || 'Failed to fetch invoices.');
                }
            } catch (err) {
                setError('An unexpected error occurred.');
            }
        };

        fetchInvoices();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Saved Invoices</h1>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <ul className="mt-6">
                {invoices.map((invoice: any) => (
                    <li key={invoice.id} className="mb-2">
                        {invoice.name} - ${invoice.amount_total.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SavedInvoices;
