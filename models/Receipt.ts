import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
    deviceID: String,
    receiptGlobalNo: Number,
    receiptCounter: Number,
    fiscalDayNo: Number,
    status: {
        type: String,
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // other fields...
});

receiptSchema.index({ receiptGlobalNo: 1 }); // Ensure ascending order

const Receipt = mongoose.models.Receipt || mongoose.model('Receipt', receiptSchema);

export default Receipt;
