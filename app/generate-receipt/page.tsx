// app/generate-receipt/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

export default function GenerateReceiptPage() {
  const [formData, setFormData] = useState({
    qrUrl: '',
    deviceID: '',
    receiptDate: '',
    receiptGlobalNo: '',
    receiptQrData: '',
    privateKey: '',
    receiptData: {
      deviceID: '',
      receiptType: '',
      receiptCurrency: '',
      receiptGlobalNo: '',
      receiptDate: '',
      receiptTotal: 0,
      receiptTaxes: '',
      previousReceiptHash: '',
    },
  });
  const [result, setResult] = useState<{ qrCode: string; hash: string; signature: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/generate-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      setResult(data);
    } else {
      alert('Error generating receipt');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Generate Receipt</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="qrUrl" placeholder="QR URL" onChange={handleChange} required className="input" />
        <Input name="deviceID" placeholder="Device ID" onChange={handleChange} required className="input" />
        <Input name="receiptDate" placeholder="Receipt Date" onChange={handleChange} required className="input" />
        <Input name="receiptGlobalNo" placeholder="Receipt Global No" onChange={handleChange} required className="input" />
        <Input name="receiptQrData" placeholder="Receipt QR Data" onChange={handleChange} required className="input" />
        <textarea
          name="privateKey"
          placeholder="Private Key"
          onChange={handleChange}
          required
          className="textarea"
        />
        <Button type="submit" className="btn">Generate</Button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Results</h2>
          <img src={result.qrCode} alt="QR Code" className="mt-4" />
          <p><strong>Hash:</strong> {result.hash}</p>
          <p><strong>Signature:</strong> {result.signature}</p>
        </div>
      )}
    </div>
  );
}
