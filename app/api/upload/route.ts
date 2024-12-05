import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

// Middleware to handle file uploads
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        console.log('Receiving file upload request...');

        // Parse uploaded file
        const data = await request.formData();
        const file = data.get('file');
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ success: false, error: 'No file uploaded' });
        }

        // Save the file temporarily
        const tempDir = path.join(process.cwd(), 'temp');
        await fs.mkdir(tempDir, { recursive: true });
        const filePath = path.join(tempDir, file.name);
        const buffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));

        console.log(`Saved file to: ${filePath}`);

        // Path to the Python script
        const scriptPath = path.join(process.cwd(), 'app', 'extract_tables.py');
        console.log(`Using Python script at: ${scriptPath}`);

        return new Promise((resolve) => {
            exec(`python "${scriptPath}" "${filePath}"`, (err, stdout, stderr) => {
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);

                // Clean up temporary file
                fs.unlink(filePath).catch(console.error);

                if (err || stderr) {
                    console.error('Error running Python script:', stderr || err);
                    resolve(NextResponse.json({ success: false, error: 'Failed to extract tables' }));
                }

                try {
                    const result = JSON.parse(stdout);
                    resolve(NextResponse.json(result));
                } catch (parseError) {
                    console.error('Error parsing Python script output:', parseError);
                    resolve(NextResponse.json({ success: false, error: 'Error parsing Python script output' }));
                }
            });
        });
    } catch (err) {
        console.error('Error in POST route:', err);
        return NextResponse.json({ success: false });
    }
}
