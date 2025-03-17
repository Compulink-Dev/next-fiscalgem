import axios from 'axios';

export async function fetchInvoiceData(invoiceId: string) {
    try {
        const response = await axios.get(`https://palladium.api/invoices/${invoiceId}`, {
            headers: {
                Authorization: `Bearer ${process.env.PALLADIUM_API_TOKEN}`,
            },
        });
        return response.data; // Replace with Palladium's actual response structure
    } catch (error: any) {
        console.error("Error fetching invoice from Palladium:", error.message);
        throw new Error("Failed to fetch invoice data from Palladium.");
    }
}

export function mapInvoiceToReceipt(invoice: any): any {
    return {
        receiptType: "FiscalInvoice",
        receiptCurrency: invoice.currency || "USD",
        receiptCounter: invoice.counter || 0,
        receiptGlobalNo: invoice.globalNo || 0,
        invoiceNo: invoice.invoiceNumber,
        buyerData: {
            buyerRegisterName: invoice.buyer.name,
            buyerTradeName: invoice.buyer.tradeName || "",
            vatNumber: invoice.buyer.vatNumber || "",
            buyerTIN: invoice.buyer.tin || "",
            buyerContacts: {
                phoneNo: invoice.buyer.contact.phone || "",
                email: invoice.buyer.contact.email || "",
            },
            buyerAddress: {
                province: invoice.buyer.address.province || "",
                city: invoice.buyer.address.city || "",
                street: invoice.buyer.address.street || "",
                houseNo: invoice.buyer.address.houseNumber || "",
                district: invoice.buyer.address.district || "",
            },
        },
        receiptNotes: invoice.notes || "",
        receiptDate: invoice.date || new Date().toISOString(),
        creditDebitNote: invoice.creditDebitNote || null,
        receiptLinesTaxInclusive: invoice.taxInclusive || true,
        receiptLines: invoice.items.map((item: any) => ({
            receiptLineType: "Sale",
            receiptLineNo: item.lineNumber || 0,
            receiptLineHSCode: item.hsCode || "",
            receiptLineName: item.name,
            receiptLinePrice: item.price,
            receiptLineQuantity: item.quantity,
            receiptLineTotal: item.total,
            taxCode: item.tax.code,
            taxPercent: item.tax.percent,
            taxID: item.tax.id,
        })),
        receiptTaxes: invoice.taxes.map((tax: any) => ({
            taxCode: tax.code,
            taxPercent: tax.percent,
            taxID: tax.id,
            taxAmount: tax.amount,
            salesAmountWithTax: tax.salesWithTax,
        })),
        receiptPayments: invoice.payments.map((payment: any) => ({
            moneyTypeCode: payment.type,
            paymentAmount: payment.amount,
        })),
        receiptTotal: invoice.totalAmount,
        receiptPrintForm: "Receipt48",
        receiptDeviceSignature: {
            hash: invoice.signatureHash,
            signature: invoice.signature,
        },
    };
}
