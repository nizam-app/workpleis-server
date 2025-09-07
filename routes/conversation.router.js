import {Router} from 'express';
import { conversationControllers } from '../modules/conversation/conversation.controllers.js';
import { authentication } from '../middlewares/authentication.middleware.js';


const conversationRouter = Router();



conversationRouter.get('/my',authentication('CLIENT','JOB_SEEKER'),conversationControllers.listOfCoversationController);
conversationRouter.get('/details/:id',authentication('CLIENT','JOB_SEEKER'),conversationControllers.conversationDetailsController);
conversationRouter.get('/messages/:id',authentication('CLIENT','JOB_SEEKER'),conversationControllers.conversationMessagesController);




export default conversationRouter;