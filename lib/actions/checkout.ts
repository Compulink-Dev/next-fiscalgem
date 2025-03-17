// @/lib/actions/checkout.ts

export const prepareCheckout = async (amount: string, currency: string, paymentType: string) => {
    try {
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency, paymentType }),
        });

        if (!response.ok) {
            throw new Error('Failed to prepare checkout');
        }

        const data = await response.json();

        // Ensure the API returns a valid `id` field (the checkoutId)
        return data.id;
    } catch (error) {
        console.error('Error preparing checkout:', error);
        throw error;
    }
};
