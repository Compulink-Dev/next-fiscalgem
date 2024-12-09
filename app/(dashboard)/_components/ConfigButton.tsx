'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cog, Gem, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ConfigButton = () => {
    const [loading, setLoading] = useState(false);
    const [configData, setConfigData] = useState<any>(null); // State to hold the retrieved config

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/get-config', {
                method: 'GET',
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to get config');
                console.error('Failed to get config:', error);
                setLoading(false);
                return;
            }

            const responseData = await res.json();
            toast.success('Config retrieved successfully');
            setConfigData(responseData); // Save the retrieved data to state
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
                    className="flex items-center gap-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <Cog className="animate-spin" /> : <Cog />}
                    <span>{loading ? 'Loading...' : 'Get Config'}</span>
                </Button>
            </form>

            {/* Display Config Data */}
            {configData && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h3 className="text-lg font-bold text-green-700">Device Configuration:</h3>
                    <pre className="text-xs text-green-600 mt-2 overflow-auto bg-white p-2 border rounded">
                        {JSON.stringify(configData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ConfigButton;
