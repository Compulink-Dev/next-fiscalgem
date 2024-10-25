// interface Address {
//     province: string;  // Province name
//     city: string;      // City, town, growth point, etc.
//     street: string;    // Street, stand number, village
//     houseNo: string;   // House number
// }

// interface Contacts {
//     phoneNo?: string;  // Phone number (optional, but required if no email)
//     email?: string;    // E-mail address (optional, but required if no phone number)
// }

// interface SignatureData {
//     hash: string;             // SHA-256 hash (binary 32)
//     signature: string;        // Cryptographic signature (binary 256, depends on algorithm)
// }

// interface SignatureDataEx extends SignatureData {
//     certificateThumbprint: string;  // SHA-1 Thumbprint of the certificate used for the signature
// }

// enum DeviceOperatingMode {
//     Online = 0,
//     Offline = 1
// }

// enum FiscalDayStatus {
//     FiscalDayClosed = 0,
//     FiscalDayOpened = 1,
//     FiscalDayCloseInitiated = 2,
//     FiscalDayCloseFailed = 3
// }

// enum FiscalDayReconciliationMode {
//     Auto = 0,
//     Manual = 1
// }

// interface FiscalCounter {
//     fiscalCounterType: FiscalCounterType;  // Type of fiscal counter (e.g., SaleByTax)
//     fiscalCounterCurrency: string;         // Currency (e.g., "USD")
//     fiscalCounterTaxID?: number;           // Tax ID for tax-related counters (e.g., "1")
//     fiscalCounterTaxPercent?: number;      // Tax percentage for tax-related counters (e.g., "15.00")
//     fiscalCounterValue: number;            // Value of the counter (sales, tax, or payment amounts)
// }

// interface Receipt {
//     receiptType: ReceiptType;          // FiscalInvoice, CreditNote, or DebitNote
//     salesAmountWithTax: number;        // Total sales amount, including tax
//     taxAmount: number;                 // Total tax amount
//     paymentAmount: number;             // Total payment amount
//     currency: string;                  // Currency (e.g., "USD")
//     taxID: number;                     // Tax ID
//     taxPercent: number;                // Tax percentage
// }



// enum FiscalCounterType {
//     SaleByTax = 0,
//     SaleTaxByTax = 1,
//     CreditNoteByTax = 2,
//     CreditNoteTaxByTax = 3,
//     DebitNoteByTax = 4,
//     DebitNoteTaxByTax = 5,
//     BalanceByMoneyType = 6
// }

// enum MoneyType {
//     Cash = 0,
//     Card = 1,
//     MobileWallet = 2,
//     Coupon = 3,
//     Credit = 4,
//     BankTransfer = 5,
//     Other = 6
// }

// enum ReceiptType {
//     FiscalInvoice = 0,
//     CreditNote = 1,
//     DebitNote = 2
// }

// enum ReceiptLineType {
//     Sale = 0,
//     Discount = 1
// }

// enum ReceiptPrintForm {
//     Receipt48 = 0,  // Printed as receipt (48 characters per line)
//     InvoiceA4 = 1   // Printed as A4 invoice
// }

// enum FiscalDayProcessingError {
//     BadCertificateSignature = 0,
//     MissingReceipts = 1,
//     ReceiptsWithValidationErrors = 2,
//     CountersMismatch = 3
// }

// enum FileProcessingStatus {
//     FileProcessingInProgress = 0,
//     FileProcessingIsSuccessful = 1,
//     FileProcessingWithErrors = 2
// }

// enum FileProcessingError {
//     IncorrectFileFormat = 0,
//     FileSentForClosedDay = 1,
//     BadCertificateSignature = 2,
//     MissingReceipts = 3,
//     ReceiptsWithValidationErrors = 4,
//     CountersMismatch = 5,
//     FileExceededAllowedWaitingTime = 6
// }

// interface CloseDayRequest {
//     deviceID: number;
//     fiscalDayNo: number;
//     fiscalDayCounters: Array<{
//         fiscalCounterType: FiscalCounterType;
//         fiscalCounterCurrency: string;
//         fiscalCounterTaxID?: number;
//         fiscalCounterTaxPercent?: number;
//         fiscalCounterValue: number;
//     }>;
//     fiscalDayDeviceSignature: SignatureData;
//     receiptCounter: number;
// }

// const closeDayPayload: CloseDayRequest = {
//     deviceID: 1111,
//     fiscalDayNo: 5,
//     fiscalDayCounters: [
//         {
//             fiscalCounterType: FiscalCounterType.SaleByTax,
//             fiscalCounterCurrency: 'USD',
//             fiscalCounterTaxID: 1,
//             fiscalCounterTaxPercent: 15,
//             fiscalCounterValue: 1000.00
//         }
//     ],
//     fiscalDayDeviceSignature: {
//         hash: 'Yjkjy=',
//         signature: 'Yy='
//     },
//     receiptCounter: 25
// };


// export default ([
//     closeDayPayload
// ])