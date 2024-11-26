import { fetchData } from "@/lib/apiUtils";


export async function GET() {
    return fetchData('getConfig', 'Failed to fetch config file data.');
}