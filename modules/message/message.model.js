import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Conversation", 
        required: true 
    },
    from: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    to: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    content: { 
        type: String, trim: true },
    mediaUrl: { type: String },  
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;