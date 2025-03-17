import { NextResponse } from 'next/server';
import { read, utils } from 'xlsx';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = read(buffer, { type: 'array' });

        // Assuming the data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const jsonData = utils.sheet_to_json(worksheet);

        return NextResponse.json({ data: jsonData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to process the file' }, { status: 500 });
    }
}
