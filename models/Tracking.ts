import mongoose, { Schema, Document } from 'mongoose';

interface TrackingDocument extends Document {
    lastReceiptGlobalNo: number;
    lastReceiptCounter: number;
    previousHash?: string;
    previousReceiptDate?: string; // New field to store the previous receipt date
}

const TrackingSchema = new Schema<TrackingDocument>({
    lastReceiptGlobalNo: { type: Number, required: true },
    lastReceiptCounter: { type: Number, required: true },
    previousHash: { type: String },
    previousReceiptDate: { type: String }, // Store the receipt date in ISO format
});

export default mongoose.models.Tracking || mongoose.model<TrackingDocument>('Tracking', TrackingSchema);
