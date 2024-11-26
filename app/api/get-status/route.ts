import { fetchData } from "@/lib/apiUtils";


export async function GET() {
    return fetchData('getStatus', 'Failed to fetch status data.');
}
