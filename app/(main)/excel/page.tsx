//@ts-nocheck
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function InvoiceUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload-invoice', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setJsonData(result.data);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="font-bold text-lg mb-2 text-green-800">Upload Invoice</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className='text-green-800' />
                <div>
                    <Button className='bg-green-600 hover:bg-green-900' type="submit">Upload</Button>
                </div>
            </form>
            {jsonData.length > 0 && (
                <>
                    {/* Display JSON Data */}
                    <pre className="mt-6 p-4 text-green-900  bg-gray-200 rounded overflow-auto text-xs" style={{ scrollbarWidth: 'none' }}>
                        {JSON.stringify(jsonData, null, 2)}
                    </pre>

                    {/* Display Data in Table */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="table-auto border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    {Object.keys(jsonData[0]).map((key) => (
                                        <th
                                            key={key}
                                            className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        >
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {jsonData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {Object.values(row).map((value, idx) => (
                                            <td
                                                key={idx}
                                                className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                                            >
                                                
                                                {value}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
