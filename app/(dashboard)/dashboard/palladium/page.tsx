'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitToFDMS } from '@/lib/submit-to-fdms';
import React, { useState } from 'react';


export default function SubmitReceipt() {
    const [invoiceId, setInvoiceId] = useState('');
    const [deviceID, setDeviceID] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await submitToFDMS(invoiceId, deviceID);
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-lg font-bold">Submit Receipt to FDMS</h1>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <Label htmlFor="invoiceId" className="block font-medium">
                        Invoice ID
                    </Label>
                    <Input
                        id="invoiceId"
                        type="text"
                        value={invoiceId}
                        onChange={(e) => setInvoiceId(e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="deviceID" className="block font-medium">
                        Device ID
                    </Label>
                    <Input
                        id="deviceID"
                        type="text"
                        value={deviceID}
                        onChange={(e) => setDeviceID(e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="bg-green-700 text-white"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
            {error && <p className="text-xs text-red-500 mt-4">Error: {error}</p>}
            {result && (
                <pre className="mt-4 p-2 bg-gray-100 rounded border">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}
