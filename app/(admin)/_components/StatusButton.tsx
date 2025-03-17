'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList, Cog, Gem, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusButton = () => {
    const [loading, setLoading] = useState(false);
    const [statusData, setStatusData] = useState<any>(null); // State to hold the retrieved config

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/get-status', {
                method: 'GET',
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to get status');
                console.error('Failed to get status:', error);
                setLoading(false);
                return;
            }

            const responseData = await res.json();
            toast.success('Config retrieved successfully');
            setStatusData(responseData); // Save the retrieved data to state
        } catch (error) {
            console.error('An error occurred during retrieval:', error);
            toast.error('An error occurred during retrieval');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <Button
                    variant={'outline'}
                    className="flex items-center justify-between"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <ClipboardList className="animate-spin" /> : <ClipboardList />}
                    <span>{loading ? 'Loading...' : 'Get Status'}</span>
                </Button>
            </form>

            {/* Display Config Data */}
            {statusData && (
                <div className="mt-4 p-4 border rounded bg-gray-50 w-full">
                    <h3 className="text-lg font-bold text-green-700">Device Status:</h3>
                    <pre className="text-xs text-green-600 mt-2 overflow-auto bg-white p-2 border rounded">
                        {JSON.stringify(statusData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default StatusButton;
