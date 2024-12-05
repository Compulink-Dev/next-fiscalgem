import { NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const tempFilePath = path.join("/tmp", file.name);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

    const scriptPath = path.join(process.cwd(), "app", "extract_pdf.py");

    try {
        // Execute the Python script
        const { stdout } = await execFileAsync("python3", [scriptPath, tempFilePath]);

        // Parse the Python script output
        const parsedData = JSON.parse(stdout);

        console.log("Parsed Data :", parsedData);


        fs.unlinkSync(tempFilePath);
        return NextResponse.json(parsedData);
    } catch (error: any) {
        console.error("Error processing PDF:", error);

        let errorMessage = "Failed to process PDF.";
        if (error.stdout) {
            try {
                // Attempt to parse error message from Python script
                const errorOutput = JSON.parse(error.stdout);
                errorMessage = errorOutput.error || errorMessage;
            } catch {
                errorMessage = error.stdout;
            }
        }

        fs.unlinkSync(tempFilePath);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
