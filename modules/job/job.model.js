import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: 2
    },
    category : {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      maxlength: 2000,
      trim: true,
    },
    images : {
        type : [String]
    },
    jobType : {
      type: String,
      enum: ["Onsite","Remote"],
      default: "Onsite",
      trim: true
    },
    timeline: {
      type: String, 
      enum : ["Flexible","Morning", "Afternoon", "Evening"],
      default : "Flexible",
      trim: true,
    },
    location: {
      type: String,
      required: [
        function () {
          return this.jobType === "Onsite";
        },
        "Location is required for Onsite jobs",
      ],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be at least 1"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "Assigned", "In_progress", "In_review", "Delivered"],
      default: "Open",
      trim: true,
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
  },
  { timestamps: true, versionKey : false }
);


const Job = mongoose.model("Job", jobSchema);

export default Job;