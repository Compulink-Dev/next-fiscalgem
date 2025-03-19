import { create } from "zustand";

interface InvoiceItem {
  lineNo: number;
  partNumber: string;
  description: string;
  quantity: number;
  priceEach: number;
  totalLineAmount: number;
}

interface Invoice {
  invoiceID: string;
  date: string;
  customer: string;
  total: number;
  items: InvoiceItem[];
}

interface InvoiceStore {
  invoices: Invoice[];
  fetchInvoices: () => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  fetchInvoices: async () => {
    try {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      set({ invoices: data });
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  },
}));
