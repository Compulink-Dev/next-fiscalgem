import { fetchInvoices } from "@/lib/sqlDb/route";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const invoices = await fetchInvoices();

    // Grouping items by Invoice ID
    const groupedInvoices = invoices.reduce((acc: any, item: any) => {
      const { strInvDocID } = item;
      if (!acc[strInvDocID]) {
        acc[strInvDocID] = {
          invoiceID: strInvDocID,
          date: item.dteJournalDate,
          customer: item.strCustName,
          total: item.decTotal,
          items: [],
        };
      }
      acc[strInvDocID].items.push({
        lineNo: item.intLineNo,
        partNumber: item.strPartNumber,
        description: item.strPartDesc,
        quantity: item.decQty,
        priceEach: item.decPriceEaExc,
        totalLineAmount: item.decLineTotExc,
      });
      return acc;
    }, {});

    return NextResponse.json(Object.values(groupedInvoices), {     headers: {
      "Access-Control-Allow-Origin": "*", // Change * to specific domain for security
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
