// app/actions/openDay.ts
export async function openFiscalDay(fiscalDayOpened: string, fiscalDayNo?: number) {
    try {
        // Ensure fiscalDayOpened is formatted correctly
        const formattedFiscalDayOpened = fiscalDayOpened.split('.')[0]; // Remove milliseconds

        const response = await fetch('/api/open-day', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                openDayRequest: { // Correct structure
                    fiscalDayOpened: formattedFiscalDayOpened,
                    fiscalDayNo,
                },
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store the response data in sessionStorage
            sessionStorage.setItem('openDayData', JSON.stringify(data));
        } else {
            console.error('Failed to open fiscal day:', data.errors);
        }

        return data;
    } catch (error) {
        console.error('An error occurred while opening fiscal day:', error);
    }
}