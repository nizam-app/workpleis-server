import jwt from 'jsonwebtoken';
import { envLoader } from '../config/envs.js';
import { messageServices } from '../modules/message/message.services.js';
import Conversation from '../modules/conversation/conversation.model.js';

const socketConnection = (io) => {

  // Auth middleware for sockets
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Socket Auth token missing"));
      const payload = jwt.verify(token, envLoader.JWT_ACCESS_TOKEN_SECRET);
      socket.user = { id: payload.id,email : payload.email, role: payload.role };
      next();
    } catch (e) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id.toString();

    // Join a conversation room after membership check
    socket.on("conversation:join", async (conversationId) => {
      try {
        const c = await Conversation.findById(conversationId);
        if (!c) return socket.emit("error", { message: "Conversation not found" });
       
        // Save membership in socket session
            socket.conversations = socket.conversations || {};
            socket.conversations[conversationId] = {
                client: String(conv.client),
                jobSeeker: String(conv.jobSeeker)
            };



        socket.join(conversationId);
        socket.emit("conversation:joined", { conversationId });
      } catch {
        socket.emit("error", { message: "Join failed" });
      }
    });

    // Send message
    socket.on("message:send", async (payload, ack) => {
      try {
        const { conversationId, content, mediaUrl } = payload || {};
        const msg = await messageServices.createMessageService({ conversationId,userId, content, mediaUrl });
        
        // emit to both participants in the room
        io.to(conversationId).emit("message:new", msg);
        if (ack) ack({ ok: true, data: msg });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
        else socket.emit("error", { message: e.message });
      }
    });

    // Mark as read
    socket.on("message:read", async ({ conversationId }) => {
      try {
        await messageServices.markReadMessageService(conversationId, userId);
        io.to(conversationId).emit("message:read:updated", { conversationId, userId });
      } catch (e) {
        socket.emit("error", { message: e.message });
      }
    });

    // typing indicator
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit("typing", { conversationId, userId, isTyping });
    });

  });
};


export default socketConnection;