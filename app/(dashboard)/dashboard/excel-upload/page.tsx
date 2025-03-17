'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) setFile(event.target.files[0]);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            alert('Please upload a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            // Make sure the API path matches the one in your Next.js backend
            const response = await fetch('/api/upload-excel', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Label>Upload Excel File</Label>
            <form onSubmit={handleSubmit}>
                <Input
                    className="my-4 text-green-700"
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                />
                <Button
                    className="bg-green-700 hover:bg-green-500"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </Button>
            </form>
            {result && (
                <pre className="text-xs text-green-700 mt-4">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}
