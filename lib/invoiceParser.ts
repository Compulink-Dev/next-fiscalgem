import { readFile } from 'fs/promises';
import pdf from 'pdf-parse';

export async function parseInvoice(filePath: string) {
    const dataBuffer = await readFile(filePath);
    const pdfData = await pdf(dataBuffer);

    // Example: Extract relevant data from the parsed text
    const text = pdfData.text;

    // Use regular expressions or patterns to extract specific fields
    const invoiceNo = extractField(text, /Invoice No:\s*(\S+)/);
    const date = extractField(text, /Date:\s*(\S+)/);
    const currency = extractField(text, /Currency:\s*(\S+)/);
    const buyerName = extractField(text, /Bill To:\s*(.+?)\n/);
    const items = extractItems(text); // Implement a function to parse table rows

    return {
        invoiceNo,
        date,
        currency,
        buyerName,
        items,
        total: 188890.10, // Replace with actual extraction
        taxTotal: 24637.84, // Replace with actual extraction
    };
}

// Extract a single field using a regex
function extractField(text: string, regex: RegExp) {
    const match = text.match(regex);
    return match ? match[1].trim() : '';
}

// Parse table rows into items
function extractItems(text: string) {
    // Implement table parsing logic
    return [
        {
            description: "Catalyst 9200L",
            quantity: 2,
            price: 21220.56,
            total: 162690.94,
            taxCode: "2.00",
        },
        // Add more items
    ];
}
