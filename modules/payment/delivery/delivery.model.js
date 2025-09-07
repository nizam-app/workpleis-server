
import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: [true, 'Order ID is required'] },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: [true, 'Task ID is required'] },
    jobSeeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Tasker ID is required'] },
    message: { type: String, maxlength: 2000 },
    files: [{ url: String, name: String }],
}, { timestamps: true, versionKey: false });


const Delivery = mongoose.model('Delivery', DeliverySchema);


export default Delivery;