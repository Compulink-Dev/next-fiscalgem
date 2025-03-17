// Example component fetching inventory
'use client';

import { useState } from 'react';

export default function FetchInventory() {
    const [inventory, setInventory] = useState<any[]>([]);

    const fetchInventory = async () => {
        const res = await fetch('/api/inventory', { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            setInventory(data);
        } else {
            console.error('Failed to fetch inventory');
        }
    };

    return (
        <div>
            <button onClick={fetchInventory}>Fetch Inventory</button>
            <pre>{JSON.stringify(inventory, null, 2)}</pre>
        </div>
    );
}
