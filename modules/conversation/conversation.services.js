import AppError from "../../utils/appError.js";
import Message from "../message/message.model.js";
import Conversation from "./conversation.model.js";



const listOfConversationService = async(userId)=>{

    const filter = { $or: [{ client: userId }, { jobSeeker: userId }] };

  const items = await Conversation.find(filter)
    .populate("client", "name")
    .populate("jobSeeker", "name")
    .sort({ updatedAt: -1 })
    .lean();

    return items;
}

const conversationDetailsService = async ( userId,conversationId) => {
  const conv = await Conversation.findById(conversationId)
    .populate("task", "title status")
    .populate("client", "name email")
    .populate("jobSeeker", "name email");

  if (!conv) {
    throw new AppError(404, "Conversation not found");
}
  // membership check
  if (
    String(conv.client) !== String(userId) &&
    String(conv.jobSeeker) !== String(userId)
  ) {
    throw new AppError(403, "Not a participant of this conversation");
  }

  return conv;
};

const conversationMessagesService = async (userId,conversationId) => {
  // verify membership
  const conv = await Conversation.findById(conversationId);
  if (!conv){
     throw new AppError(404, "Conversation not found");
}
  if (
    String(conv.client) !== String(userId) &&
    String(conv.jobSeeker) !== String(userId)
  ) {
    throw new AppError(403, "Not a participant");
  }

  const query = { conversation: conversationId };
//   if (before) {
//     // cursor pagination
//     query._id = { $lt: new mongoose.Types.ObjectId(before) };
//   }

  const messages = await Message.find(query)
    .sort({ _id: -1 })
    // .limit(Number(limit))
    .lean();

  return messages.reverse(); 
};


export const conversationServices = {
    listOfConversationService,
    conversationDetailsService,
    conversationMessagesService
}