
import mongoose from 'mongoose';

const LedgerSide = Object.freeze({ DEBIT: 'DEBIT', CREDIT: 'CREDIT' });
const LedgerType = Object.freeze({ HOLD: 'HOLD', RELEASE: 'RELEASE', REFUND: 'REFUND', FEE: 'FEE', REVERSAL: 'REVERSAL', PAYOUT: 'PAYOUT' });


const LedgerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
    side: { type: String, enum: Object.values(LedgerSide),  required: true },
    type: { type: String, enum: Object.values(LedgerType),  required: true },
    amount: { type: Number, required: true, min: [1, 'Amount must be > 0'] },
    currency: { type: String, default: 'usd' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', index: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', index: true },
    escrow: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow', index: true },
    note: { type: String },
    status: { type: String, default: 'SUCCESS', index: true }
}, { timestamps: true, versionKey: false });


LedgerSchema.index({ user: 1, createdAt: -1 });

export default LedgerSchema;