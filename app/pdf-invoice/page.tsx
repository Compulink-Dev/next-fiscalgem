"use client";

import React, { useState } from "react";

const SubmitPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [response, setResponse] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please upload a file");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/pdf-upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log('Received Data :', data);

            if (data.error) {
                alert("Failed to process PDF: " + data.error);
            } else {
                setResponse(data);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };

    return (
        <div>
            <h1>Submit Invoice PDF</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button type="submit">Upload and Process</button>
            </form>

            {response && (
                <pre className="text-xs text-green-700 p-4">
                    <code>{JSON.stringify(response, null, 2)}</code>
                </pre>
            )}
        </div>
    );
};

export default SubmitPage;
