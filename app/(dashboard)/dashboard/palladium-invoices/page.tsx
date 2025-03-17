'use client';

import Spin from '@/app/_components/Loader';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('/api/get-invoices');
                const data = await response.json();

                console.log("Palladium Data: ", data);


                if (data.success) {
                    setInvoices(data.data);
                } else {
                    setError('Failed to fetch invoices');
                }
            } catch (err) {
                setError('Error fetching invoices');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) return <div className="flex items-center justify-center">
        <Spin />
    </div>;
    if (error) return <p className='text-xs flex items-center justify-center text-red-500'>Error: {error}</p>;

    return (
        <div>
            <h1>Invoices</h1>
            <table>
                <thead>
                    <tr className='space-x-6'>
                        <th>Invoice ID</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className=''>
                            <td>{invoice.id}</td>
                            <td>{invoice.amount}</td>
                            <td>{invoice.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
