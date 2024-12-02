'use client';

import { useState } from 'react';

export default function ExtractPayloadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [payload, setPayload] = useState<any | null>(null);

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

        const response = await fetch('/api/extraction', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        setPayload(data.payload);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button type="submit">Extract Payload</button>
            </form>
            {payload && <pre>{JSON.stringify(payload, null, 2)}</pre>}
        </div>
    );
}
