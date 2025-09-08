import mongoose from "mongoose";


const contactSchema = new mongoose.Schema({
      fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
      },
      roleTitle: {
        type: String,
        trim: true,
      },
      preferredCommunication: {
        type: String,
        enum: ["email", "phone", "in-app"],
        required: [true, "Preferred communication method is required"],
      },
      bestTimeToContact: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
        required: [true, "Best time to contact is required"],
      },
    },{timestamps : false, versionKey : false, _id : false})

const specialTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 3 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description must not exceed 2000 characters"],
    },
    urgency: {
      type: String,
      enum: ["immediate", "flexible"],
      required: [true, "Urgency is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be at least 1"],
    },
    document: {
      type: String,  
    },
    contact: contactSchema,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const SpecialTask = mongoose.model("SpecialTask", specialTaskSchema);

export default SpecialTask;
