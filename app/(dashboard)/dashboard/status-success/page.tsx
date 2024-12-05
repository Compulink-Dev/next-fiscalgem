'use client';

import BackButton from '@/app/_components/BackButton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ConfigSuccess = () => {
    const [statusData, setStatusData] = useState<any>(null);
    const router = useRouter()

    useEffect(() => {
        // Retrieve data from session storage
        const data = sessionStorage.getItem('statusData');
        if (data) {
            setStatusData(JSON.parse(data));
        }
    }, []);

    if (!statusData) {
        return <div>Loading device status...</div>;
    }

    return (
        <div className="">
            <div className="p-4 flex items-center justify-between">
                <h1 className="text-lg font-bold mb-4 text-green-800">Device Configuration</h1>
                <BackButton />
            </div>
            <pre className="bg-gray-100 p-4 border rounded overflow-auto text-green-700 text-xs">
                {JSON.stringify(statusData, null, 2)}
            </pre>
        </div>
    );
};

export default ConfigSuccess;
