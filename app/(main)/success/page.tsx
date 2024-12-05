// app/success/page.tsx
'use client';

import { useEffect, useState } from 'react';

const SuccessPage = () => {
    const [openDayData, setOpenDayData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('openDayData');
        if (storedData) {
            setOpenDayData(JSON.parse(storedData));
        }
    }, []);

    if (!openDayData) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-green-900">Fiscal Day Opened Successfully</h1>
            <pre className="bg-green-100 p-4 text-xs text-green-700 rounded">
                {JSON.stringify(openDayData, null, 2)}
            </pre>
        </div>
    );
};

export default SuccessPage;
