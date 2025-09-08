
import mongoose from 'mongoose';
const EscrowStatus = [
    'INIT', // intent created, not confirmed
    'HELD', // payment captured and held by platform
    'AWAITING_APPROVAL', // tasker delivered; waiting buyer/auto-approve
    'RELEASED', // released to tasker wallet (platform DB), not yet withdrawn
    'PAID_OUT', // withdrawn to tasker bank (Stripe transfer/payout confirmed)
    'REFUNDED', // refunded to buyer
    'DISPUTED',
    'CANCELED'
];


const EscrowSchema = new mongoose.Schema({
    task: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task', index: true,
        required: [true, 'Task ID is required for escrow'] 
    },
    offer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Offer', index: true, 
        required: [true, 'Offer ID is required for escrow'] 
    },
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', index: true, 
        required: [true, 'Buyer ID is required for escrow'] 
    },
    jobSeeker: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', index: true, 
        required: [true, 'Tasker ID is required for escrow'] 
    },


    currency: { 
        type: String, 
        enum: ['usd', 'eur', 'gbp', 'aud'], 
        default: 'usd' 
    },
    amount: { 
        type: Number, 
        required: [true, 'amount is required'], 
        min: [1, 'Amount must be > 0'] 
    },
    jobSeekerReceives: { 
        type: Number, 
        required: [true, 'Job seeker receives amount is required'], 
        min: [1, 'Amount must be > 0'] 
    },
    serviceFee: { 
        type: Number, 
        required: [true, 'Service fee is required'], 
        min: [0, 'Service fee cannot be negative'] 
    },

    status: { 
        type: String, 
        enum: EscrowStatus, index: true, 
        default: 'INIT' 
    },

    stripePaymentIntentId: { 
        type: String, index: true, 
        required: [true, 'Stripe PaymentIntent ID is required'] 
    },
    stripeTransferId: { 
        type: String, 
        index: true, 
        default: null 
    }, // set when paid out
    deliveredAt : {
        type : Date
    },
    releasedAt : {
        type : Date
    }
}, { timestamps: true, versionKey: false });


EscrowSchema.index({ client: 1, status: 1, createdAt: -1 });
EscrowSchema.index({ jobSeeker: 1, status: 1, createdAt: -1 });
EscrowSchema.index({ task: 1, offer: 1 }, { unique: true });


const Escrow = mongoose.model('Escrow', EscrowSchema)
export default Escrow;



// ### 🔑 Key Improvements

// * Added **required messages** for production error clarity.
// * Ensured **positive amounts only** (`min` validation).
// * Added **currency enum** for consistency.
// * Made `stripePaymentIntentId` required to prevent broken flows.
// * Added **compound index** `(taskId, offerId)` to ensure one escrow per accepted offer.
// * Removed `__v` (versionKey) for cleaner documents.


