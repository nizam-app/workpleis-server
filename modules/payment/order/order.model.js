import mongoose from 'mongoose';

const OrderStatus = [
    'PLACED', // buyer paid, order started
    'IN_PROGRESS', // tasker working
    'DELIVERED', // tasker submitted delivery
    'AWAITING_APPROVAL', // waiting buyer approval / auto-approve window
    'APPROVED', // buyer approved
    'CANCELED', // canceled before completion
    'REFUNDED' // refunded fully
];


const OrderSchema = new mongoose.Schema({
    task: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task', 
        required: [true, 'Task ID is required'] 
    },
    offer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Offer', 
        equired: [true, 'Offer ID is required'] 
    },
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Buyer ID is required'] 
    },
    jobSeeker: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Tasker ID is required'] 
    },
    status: { 
        type: String, 
        enum: OrderStatus, 
        default: 'PLACED', 
        index: true 
    },
    amount: { 
        type: Number, 
        required: [true, 'Order amount is required'], 
        min: [1, 'Amount must be > 0'] 
    },
    currency: { 
        type: String, 
        default: 'usd' 
    },
    escrow: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Escrow' 
    },
    autoApproveAt: { type: Date }, // set when delivered
}, { timestamps: true, versionKey: false });


OrderSchema.index({ client: 1, createdAt: -1 });
OrderSchema.index({ jobSeeker: 1, createdAt: -1 });


export default Order = mongoose.model('Order', OrderSchema);
