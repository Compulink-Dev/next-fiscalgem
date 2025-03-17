export function transformInvoice(invoice: any) {
    return {
        receipt: {
            receiptType: "FiscalInvoice",
            receiptCurrency: "USD",
            receiptCounter: invoice.id,
            receiptGlobalNo: 0,
            invoiceNo: invoice.name,
            buyerData: {
                buyerRegisterName: invoice.partner_id[1],
                buyerTradeName: "",
                vatNumber: "string",
                buyerTIN: "string",
                buyerContacts: {
                    phoneNo: "123456789",
                    email: "example@example.com",
                },
                buyerAddress: {
                    province: "Province",
                    city: "City",
                    street: "Street",
                    houseNo: "123",
                    district: "District",
                },
            },
            receiptNotes: "Thank you for your purchase!",
            receiptDate: new Date().toISOString(),
            receiptLinesTaxInclusive: true,
            receiptLines: [
                {
                    receiptLineType: "Sale",
                    receiptLineNo: 1,
                    receiptLineHSCode: "1234",
                    receiptLineName: "Product",
                    receiptLinePrice: 100.0,
                    receiptLineQuantity: 1,
                    receiptLineTotal: 100.0,
                    taxCode: "VAT",
                    taxPercent: 15.0,
                    taxID: 1,
                },
            ],
            receiptTotal: invoice.amount_total,
            receiptPayments: [
                {
                    moneyTypeCode: "Cash",
                    paymentAmount: invoice.amount_total,
                },
            ],
        },
    };
}
