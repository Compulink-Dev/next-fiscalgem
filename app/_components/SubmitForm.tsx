import { useState } from 'react';
import axios from 'axios';

function ReceiptForm() {
    const [formData, setFormData] = useState({
        // Initialize fields with placeholder data
        receiptType: 'FiscalInvoice',
        receiptCurrency: 'USD',
        receiptCounter: 1,
        receiptGlobalNo: 10001,
        invoiceNo: 'INV-001',
        receiptDate: new Date().toISOString(),
        buyerData: {
            buyerRegisterName: '',
            buyerTradeName: '',
            vatNumber: '',
            buyerTIN: '',
            buyerContacts: { phoneNo: '', email: '' },
            buyerAddress: {
                province: '',
                city: '',
                street: '',
                houseNo: '',
                district: ''
            }
        },
        receiptLines: [
            {
                receiptLineType: 'Sale',
                receiptLineNo: 1,
                receiptLineHSCode: 'HS123456',
                receiptLineName: 'Item 1',
                receiptLinePrice: 100.0,
                receiptLineQuantity: 2,
                receiptLineTotal: 200.0,
                taxCode: 'TAX001',
                taxPercent: 15.0,
                taxID: 1
            }
        ],
        receiptTotal: 200.0,
    });

    const [response, setResponse] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/submitReceipt', { receiptData: formData });
            setResponse(response.data);
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.error || error.message);
            setResponse(null);
        }
    };

    return (
        <div>
            <h2>Submit Receipt</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Receipt Type:
                    <input
                        type="text"
                        name="receiptType"
                        value={formData.receiptType}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Receipt Currency:
                    <input
                        type="text"
                        name="receiptCurrency"
                        value={formData.receiptCurrency}
                        onChange={handleChange}
                    />
                </label>
                {/* Add additional input fields as needed for buyerData, receiptLines, etc. */}

                <button type="submit">Submit Receipt</button>
            </form>

            {response && <div>Submission successful: {JSON.stringify(response.data)}</div>}
            {error && <div>Error submitting receipt: {error}</div>}
        </div>
    );
}

export default ReceiptForm;
