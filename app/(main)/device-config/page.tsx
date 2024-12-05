// app/device-config/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

const DeviceConfigPage = () => {
    const [config, setConfig] = useState(null);

    const fetchConfig = async () => {
        const res = await fetch('/api/get-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceID: 'your-device-id' }),
        });

        const data = await res.json();
        setConfig(data);
    };

    return (
        <div>
            <Button onClick={fetchConfig}>Fetch Device Configuration</Button>
            {config && (
                <div>
                    <h3>Configuration Data</h3>
                    <pre>{JSON.stringify(config, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default DeviceConfigPage;
