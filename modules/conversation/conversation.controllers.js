import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { conversationServices } from "./conversation.services.js";


const listOfCoversationController = asyncHandler(async(req,res)=>{
    const userId = req.user.id;

    const data = await conversationServices.listOfConversationService(userId);

      sendResponse(res,{
                    statusCode : 200,
                    success : true,
                    message : 'Retrived all conversation',
                    data: data
                });

});


const conversationDetailsController = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const conversationId = req.params.id;

    const data = await conversationServices.conversationDetailsService(userId,conversationId);

      sendResponse(res,{
                    statusCode : 200,
                    success : true,
                    message : 'Retrived all conversation details',
                    data: data
                });

});

const conversationMessagesController = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const conversationId = req.params.id;

    const data = await conversationServices.conversationMessagesService(userId,conversationId);

      sendResponse(res,{
                    statusCode : 200,
                    success : true,
                    message : 'Retrived all messages',
                    data: data
                });

});


export const conversationControllers = {
    listOfCoversationController,
    conversationDetailsController,
    conversationMessagesController
}