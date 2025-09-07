import AppError from "../../utils/appError.js";
import Conversation from "../conversation/conversation.model.js";
import Message from "./message.model.js";




const createMessageService = async(conversationId, from, content, mediaUrl)=>{
    
  const conv = await Conversation.findById(conversationId);
  if (!conv) throw new AppError(404, "Conversation not found");

  // membership + figure out receiver
  let to = null;
  if (String(conv.client) === String(from)) to = conv.jobSeeker;
  else if (String(conv.jobSeeker) === String(from)) to = conv.client;
  else throw new AppError(403, "Not a participant");

  if (!content && !mediaUrl) throw new AppError(400, "Message content is empty");


  const newMessage = new Message({
    conversation: conversationId,
    from,
    to,
    content: content || "", 
    mediaUrl: mediaUrl || null,
  })
   await newMessage.save();

  // update conversation snapshot
//   conv.lastMessage = { text: content?.slice(0, 200) || "[media]", at: new Date(), by: from };
//   await conv.save();

  return newMessage;

}


const markReadMessageService = async (conversationId, userId) => {
  const conv = await Conversation.findById(conversationId);
  if (!conv) throw new AppError(404, "Conversation not found");

  if (
    String(conv.client) !== String(userId) &&
    String(conv.jobSeeker) !== String(userId)
  ) throw new AppError(403, "Not a participant");

  await Message.updateMany(
    { conversation: conversationId, to: userId, isRead: false },
    { $set: { isRead: true } }
  );

  return { ok: true };
};


export const messageServices = {
    createMessageService,
    markReadMessageService
}