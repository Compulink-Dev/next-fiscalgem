// function calculateFiscalCounters(receipts: Receipt[]): FiscalCounter[] {
//     const counters: FiscalCounter[] = [];

//     // Loop through each receipt and update the corresponding fiscal counters
//     receipts.forEach(receipt => {
//         // Check the receipt type and calculate the appropriate fiscal counters
//         if (receipt.receiptType === ReceiptType.FiscalInvoice) {
//             // Add sales amount (including tax) to SaleByTax
//             counters.push({
//                 fiscalCounterType: FiscalCounterType.SaleByTax,
//                 fiscalCounterCurrency: receipt.currency,
//                 fiscalCounterTaxID: receipt.taxID,
//                 fiscalCounterValue: receipt.salesAmountWithTax
//             });

//             // Add tax amount to SaleTaxByTax
//             counters.push({
//                 function calculateFiscalCounters(receipts: Receipt[]): FiscalCounter[] {
//                     const counters: FiscalCounter[] = [];

//                     // Loop through each receipt and update the corresponding fiscal counters
//                     receipts.forEach(receipt => {
//                         // Check the receipt type and calculate the appropriate fiscal counters
//                         if (receipt.receiptType === ReceiptType.FiscalInvoice) {
//                             // Add sales amount (including tax) to SaleByTax
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.SaleByTax,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterTaxID: receipt.taxID,
//                                 fiscalCounterValue: receipt.salesAmountWithTax
//                             });

//                             // Add tax amount to SaleTaxByTax
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.SaleTaxByTax,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterTaxID: receipt.taxID,
//                                 fiscalCounterTaxPercent: receipt.taxPercent,
//                                 fiscalCounterValue: receipt.taxAmount
//                             });

//                             // Add payment amount to BalanceByMoneyType
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.BalanceByMoneyType,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterValue: receipt.paymentAmount
//                             });
//                         } else if (receipt.receiptType === ReceiptType.CreditNote) {
//                             // Subtract sales amount (including tax) from CreditNoteByTax
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.CreditNoteByTax,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterTaxID: receipt.taxID,
//                                 fiscalCounterValue: -receipt.salesAmountWithTax
//                             });

//                             // Subtract tax amount from CreditNoteTaxByTax
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.CreditNoteTaxByTax,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterTaxID: receipt.taxID,
//                                 fiscalCounterTaxPercent: receipt.taxPercent,
//                                 fiscalCounterValue: -receipt.taxAmount
//                             });

//                             // Subtract payment amount from BalanceByMoneyType
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.BalanceByMoneyType,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterValue: -receipt.paymentAmount
//                             });
//                         } else if (receipt.receiptType === ReceiptType.DebitNote) {
//                             // Add sales amount (including tax) to DebitNoteByTax
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.DebitNoteByTax,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterTaxID: receipt.taxID,
//                                 fiscalCounterValue: receipt.salesAmountWithTax
//                             });

//                             // Add tax amount to DebitNoteTaxByTax
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.DebitNoteTaxByTax,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterTaxID: receipt.taxID,
//                                 fiscalCounterTaxPercent: receipt.taxPercent,
//                                 fiscalCounterValue: receipt.taxAmount
//                             });

//                             // Add payment amount to BalanceByMoneyType
//                             counters.push({
//                                 fiscalCounterType: FiscalCounterType.BalanceByMoneyType,
//                                 fiscalCounterCurrency: receipt.currency,
//                                 fiscalCounterValue: receipt.paymentAmount
//                             });
//                         }
//                     });

//                     // Return the final fiscal counters for the fiscal day
//                     return counters;
//                 }

//         // Add payment amount to BalanceByMoneyType
//         counters.push({
//                     fiscalCounterType: FiscalCounterType.BalanceByMoneyType,
//                     fiscalCounterCurrency: receipt.currency,
//                     fiscalCounterValue: receipt.paymentAmount
//                 });
//             } else if (receipt.receiptType === ReceiptType.CreditNote) {
//                 // Subtract sales amount (including tax) from CreditNoteByTax
//                 counters.push({
//                     fiscalCounterType: FiscalCounterType.CreditNoteByTax,
//                     fiscalCounterCurrency: receipt.currency,
//                     fiscalCounterTaxID: receipt.taxID,
//                     fiscalCounterValue: -receipt.salesAmountWithTax
//                 });

//                 // Subtract tax amount from CreditNoteTaxByTax
//                 counters.push({
//                     fiscalCounterType: FiscalCounterType.CreditNoteTaxByTax,
//                     fiscalCounterCurrency: receipt.currency,
//                     fiscalCounterTaxID: receipt.taxID,
//                     fiscalCounterTaxPercent: receipt.taxPercent,
//                     fiscalCounterValue: -receipt.taxAmount
//                 });

//                 // Subtract payment amount from BalanceByMoneyType
//                 counters.push({
//                     fiscalCounterType: FiscalCounterType.BalanceByMoneyType,
//                     fiscalCounterCurrency: receipt.currency,
//                     fiscalCounterValue: -receipt.paymentAmount
//                 });
//             } else if (receipt.receiptType === ReceiptType.DebitNote) {
//                 // Add sales amount (including tax) to DebitNoteByTax
//                 counters.push({
//                     fiscalCounterType: FiscalCounterType.DebitNoteByTax,
//                     fiscalCounterCurrency: receipt.currency,
//                     fiscalCounterTaxID: receipt.taxID,
//                     fiscalCounterValue: receipt.salesAmountWithTax
//                 });

//                 // Add tax amount to DebitNoteTaxByTax
//                 counters.push({
//                     fiscalCounterType: FiscalCounterType.DebitNoteTaxByTax,
//                     fiscalCounterCurrency: receipt.currency,
//                     fiscalCounterTaxID: receipt.taxID,
//                     fiscalCounterTaxPercent: receipt.taxPercent,
//                     fiscalCounterValue: receipt.taxAmount
//                 });

//                 // Add payment amount to BalanceByMoneyType
//                 counters.push({
//                     fiscalCounterType: FiscalCounterType.BalanceByMoneyType,
//                     fiscalCounterCurrency: receipt.currency,
//                     fiscalCounterValue: receipt.paymentAmount
//                 });
//             }
//         });

//     // Return the final fiscal counters for the fiscal day
//     return counters;
// }
