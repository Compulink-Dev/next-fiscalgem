'use client';

import BackButton from '@/app/_components/BackButton';
import { useEffect, useState } from 'react';

const ConfigSuccess = () => {
    const [configData, setConfigData] = useState<any>(null);


    useEffect(() => {
        // Retrieve data from session storage
        const data = sessionStorage.getItem('configData');
        if (data) {
            setConfigData(JSON.parse(data));
        }
    }, []);

    if (!configData) {
        return <div>Loading device status...</div>;
    }

    return (
        <div className="">
            <div className="p-4 flex items-center justify-between">
                <h1 className="text-lg font-bold mb-4 text-green-800">Device Configuration</h1>
                <BackButton />
            </div>
            <pre className="bg-gray-100 p-4 border rounded overflow-auto text-green-700 text-xs">
                {JSON.stringify(configData, null, 2)}
            </pre>
        </div>
    );
};

export default ConfigSuccess;
