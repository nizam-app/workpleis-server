
import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripePaymentMethodId: { type: String, required: true, unique: true },
    brand: { type: String }, // visa, mastercard
    cardNumber: { type: String },
    expMonth: { type: Number },
    expYear: { type: Number },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;