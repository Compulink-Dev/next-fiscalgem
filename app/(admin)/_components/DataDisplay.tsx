// app/components/DataDisplay.tsx
'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DataDisplayProps {
    sessionStorageKey: string;
    title: string;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ sessionStorageKey, title }) => {
    const [data, setData] = useState<any>(null);

    const router = useRouter()

    useEffect(() => {
        const storedData = sessionStorage.getItem(sessionStorageKey);
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, [sessionStorageKey]);

    if (!data) return <p>Loading {title.toLowerCase()}...</p>;

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-4 text-green-900">{title}</h1>
                <Button
                    onClick={() => router.back()}
                    className='bg-green-800 hover:bg-green-600 flex items-center'>
                    <ChevronLeft />
                    <p className="">Back</p>
                </Button>
            </div>
            <pre className="bg-green-100 my-4 p-4 text-xs text-green-700 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default DataDisplay;
