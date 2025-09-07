import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Offer price is required"],
      min: [1, "Price must be greater than 0"],
    },
    message: {
      type: String,
      maxlength: 1000,
    },
    completionTime: {
      type: String,  
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey : false }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;