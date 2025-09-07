import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobSeeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);
conversationSchema.index({ client: 1, jobSeeker: 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;