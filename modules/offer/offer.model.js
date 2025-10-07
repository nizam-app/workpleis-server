import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    serviceProvider: {
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
      type: String
    },
    completionTime: {
      type: String,  
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    rejectionmessage: {
      type: String
    }
  },
  { timestamps: true, versionKey : false }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;