'use client'
// app/get-config/page.tsx
import React, { useState } from 'react';

const GetConfigPage: React.FC = () => {
    const [configData, setConfigData] = useState(null);

    const onSubmit = async () => {
        try {
            const response = await fetch('/api/get-config');
            const data = await response.json();
            console.log('Fetched Data:', data);
            setConfigData(data);
        } catch (error) {
            console.error('Failed to fetch config data:', error);
        }
    };

    return (
        <div>
            <h1>Fetch ZIMRA Config Data</h1>
            <button onClick={onSubmit}>Get Config Data</button>
            {configData ? (
                <div>
                    <h2>Configuration Data</h2>
                    <pre>{JSON.stringify(configData, null, 2)}</pre>
                </div>
            ) : (
                <p>No data fetched</p>
            )}
        </div>
    );
};

export default GetConfigPage;
