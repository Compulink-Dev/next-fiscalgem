import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("pdfFile") as File;

        if (!file) {
            return NextResponse.json({ error: 'File not provided' }, { status: 400 });
        }

        return NextResponse.json({});
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }
}
