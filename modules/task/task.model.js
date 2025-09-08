import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: 2
    },
    category : {
      type: String,
      required: [true, "Category is required"]
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be at least 1"],
    },
    projectType: {
      type: String,
      enum: ["one-time", "ongoing", "hourly"],
      default: "one-time",
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      default: "beginner",
    },
    timeline: {
      type: String, 
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      maxlength: 2000,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    location: {
      type : String,
      required : [true, 'Location is required']
    },
    status: {
      type: String,
      enum: ["open", "assigned", "in_progress", "completed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveredAt : {
      type : Date
    }
  },
  { timestamps: true, versionKey : false }
);


const Task = mongoose.model("Task", taskSchema);

export default Task;