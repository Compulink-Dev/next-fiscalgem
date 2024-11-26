'use client'
import { useReceiptStore } from "@/lib/useReceiptStore";
// import Invoice from "./_components/Main-Invoice";
import Invoice from "./_components/Invoice-Form";


const payload = {
    "deviceID": 19034,
    "receipt": {
        "receiptType": "1",
        "receiptCurrency": "1",
        "receiptCounter": 51,
        "receiptGlobalNo": 81,
        "invoiceNo": "Amet pariatur Iure",
        "buyerData": {
            "buyerRegisterName": "Philip Berg",
            "buyerTradeName": "Garrett Duffy",
            "vatNumber": "508454545",
            "buyerTIN": "5084545454",
            "buyerContacts": {
                "phoneNo": "+1 (554) 542-6136",
                "email": "suxyr@mailinator.com"
            },
            "buyerAddress": {
                "province": "Sed magnam voluptate",
                "city": "Vel omnis ut aut mol",
                "street": "Minus dolorem verita",
                "houseNo": "Est ut ab dolore Na",
                "district": "Itaque qui velit vol"
            }
        },
        "receiptDate": "1989-02-11T21:17",
        "receiptLinesTaxInclusive": false,
        "receiptNotes": "Itaque dignissimos n",
        "receiptLines": [
            {
                "receiptLineType": "0",
                "receiptLineNo": 26,
                "receiptLineHSCode": "122",
                "receiptLineName": "Sierra Kirkland",
                "receiptLinePrice": 29,
                "receiptLineQuantity": 777,
                "receiptLineTotal": 74,
                "taxPercent": 0,
                "taxCode": "a",
                "taxID": 2
            }
        ],
        "receiptTaxes": [
            {
                "taxCode": "a",
                "taxID": 1,
                "taxPercent": 0,
                "taxAmount": 0,
                "salesAmountWithTax": 49
            }
        ],
        "receiptPayments": [
            {
                "moneyTypeCode": "4",
                "paymentAmount": 28
            }
        ],
        "receiptTotal": 74,
        "receiptDeviceSignature": {
            "hash": "0f4a45c20cd42ce1a1b658c53c6a95dc",
            "signature": "iz9K5BXfSu+4fEBEkUXOJ1GRZNzQCqmMqYl1NkTWSlHaMnTp6OuNqrCMFGKQaoJhedVyCg5DuZUB20kqYUUnllARbUlFPpNu2btuWBfq0488zz8loIxfafYC6VIx8Hc5P+kcaEsX6dYwqS6XCo/OYUQccZQCEB8jsG7kHl6nnfuW0SSgetDZCGg1cGqpbKboWBlZdWVXzAfEre1aRZOyJ88UCFZDpMGehEdBLTVz3felgyC5NyhDVT3iIvVUfBxlmMs1DB0uMnHPMASGENe+EPg8WCkTMrsIBa/UFr/ov16WyYdrR/eC2pJPje/vYWjWcIYNdB9ItqZJPYMVm7xQ1g=="
        }
    }
};

export default function App() {
    const { receiptSignature, qrUrl, finalPayload } = useReceiptStore();

    const parsedPayload = typeof finalPayload === "string" ? JSON.parse(finalPayload) : finalPayload;
    console.log("Frontend Payload  :", parsedPayload);
    console.log("Fixed Payload :", payload);


    if (!receiptSignature) return <div>No data available</div>;
    // <Invoice data={finalPayload!} qrUrl={qrUrl} payload={JSON.stringify(finalPayload)} />
    return <Invoice data={parsedPayload} qrUrl={qrUrl} />;
    // return <Invoice data={payload} />;
}
