import mongoose from 'mongoose';


const PayoutStatus = ['REQUESTED', 'PROCESSING', 'PAID', 'FAILED', 'CANCELED'];


const PayoutRequestSchema = new mongoose.Schema({
    jobSeeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Tasker ID is required'] },
    amount: { type: Number, required: [true, 'Payout amount is required'], min: [1, 'Amount must be > 0'] },
    currency: { type: String, default: 'usd' },
    escrows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Escrow' }], 
    status: { type: String, enum: PayoutStatus, default: 'REQUESTED', index: true },
    stripeTransferId: { type: String },
    error: { type: String }
}, { timestamps: true, versionKey: false });


PayoutRequestSchema.index({ jobSeeker: 1, createdAt: -1 });

const PayoutRequest = mongoose.model('PayoutRequest', PayoutRequestSchema);

export default PayoutRequest;
 