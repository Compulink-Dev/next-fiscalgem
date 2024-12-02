import { create } from 'zustand';

type ReceiptStore = {
    receiptSignature: { hash: string; signature: string } | null;
    res: any | null;
    qrUrl: string | null;
    error: string | null;
    previousHash: string | null
    md5Hash16: string | null;
    finalPayload: string | null;
    setReceiptSignature: (signature: { hash: string; signature: string } | null) => void;
    setResponse: (response: any | null) => void;
    setQrUrl: (url: string | null) => void;
    setError: (error: string | null) => void;
    setPreviousHash: (hash: string | null) => void;
    setMd5Hash16: (hash: string | null) => void;
    setFinalPayload: (payload: string | null) => void;
};

export const useReceiptStore = create<ReceiptStore>((set) => ({
    receiptSignature: null,
    res: null,
    qrUrl: null,
    error: null,
    previousHash: null,
    md5Hash16: null,
    finalPayload: null,
    setReceiptSignature: (signature) => set({ receiptSignature: signature }),
    setResponse: (response) => set({ res: response }),
    setQrUrl: (url) => set({ qrUrl: url }),
    setError: (error) => set({ error }),
    setMd5Hash16: (hash) => set({ md5Hash16: hash }),
    setPreviousHash: (hash) => set({ previousHash: hash }),
    setFinalPayload: (payload) => set({ finalPayload: payload }),
}));
