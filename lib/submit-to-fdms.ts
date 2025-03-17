// utils/api.ts
export async function submitToFDMS(invoiceId: string, deviceID: string) {
    try {
        const response = await fetch('/api/palladium-submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invoiceId, deviceID }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit receipt');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error calling FDMS API:', error.message);
        throw error;
    }
}
