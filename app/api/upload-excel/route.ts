//@ts-nocheck
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { Readable } from 'stream';

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure formidable for file uploads
const form = new IncomingForm({
    multiples: false,
    uploadDir: uploadDir,
    keepExtensions: true,
});

// Ensure the API runs server-side
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
    try {
        // Convert the Request body to a Node.js readable stream
        const readableStream = Readable.from(req.body as any);

        // Parse the form data using formidable
        const formData: any = await new Promise((resolve, reject) => {
            form.parse(readableStream as any, (err: any, fields: any, files: any) => {
                if (err) {
                    console.error('Formidable parse error:', err);
                    return reject(err);
                }
                resolve({ fields, files });
            });
        });

        // Check if a file was uploaded
        if (!formData.files || !formData.files.file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const file = formData.files.file;
        const filePath = file.filepath;

        console.log('File uploaded:', file.originalFilename, filePath);

        // Path to the Python script
        const pythonScript = path.join(process.cwd(), 'actions/parse-excel.py');
        if (!fs.existsSync(pythonScript)) {
            console.error('Python script not found at:', pythonScript);
            return NextResponse.json({ error: 'Python script not found' }, { status: 500 });
        }

        // Read the uploaded file and process it using the Python script
        const pythonProcess = spawn('python3', [pythonScript]);

        const fileData = fs.readFileSync(filePath);
        pythonProcess.stdin.write(fileData);
        pythonProcess.stdin.end();

        let output = '';
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        let errorOutput = '';
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Wait for the Python process to finish
        return new Promise((resolve) => {
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python process exited with code:', code);
                    console.error('Python error output:', errorOutput);
                    resolve(
                        NextResponse.json({ error: 'Error processing Excel file', details: errorOutput }, { status: 500 })
                    );
                } else {
                    try {
                        const parsedData = JSON.parse(output);
                        resolve(NextResponse.json({ data: parsedData }, { status: 200 }));
                    } catch (err) {
                        console.error('Error parsing Python output:', err);
                        resolve(NextResponse.json({ error: 'Error parsing Python output' }, { status: 500 }));
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error handling upload:', error);
        return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
    }
}
