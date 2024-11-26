import { fetchData } from "@/lib/apiUtils";

export async function GET() {
    return fetchData('submittedFileList', 'Failed to fetch submitted file data.');
}