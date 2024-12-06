import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: any;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
    if (!invoice) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invoice Details</DialogTitle>
                </DialogHeader>
                <div>
                    <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
                    <p><strong>Buyer:</strong> {invoice.buyerData?.buyerRegisterName}</p>
                    <p><strong>Date:</strong> {new Date(invoice.receiptDate).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${(invoice.receiptTotal || 0).toFixed(2)}</p>
                    {/* Add more details as needed */}
                </div>
            </DialogContent>
        </Dialog>
    );
};
