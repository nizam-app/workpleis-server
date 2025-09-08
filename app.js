
import express from 'express';
import cors from 'cors';
import { globalErrorHandle } from './utils/globalErrorHandler.js';
import { notFoundHandler } from './utils/notFoundRoute.js';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import taskRouter from './routes/task.router.js';
import offerRouter from './routes/offer.router.js';
import reviewRouter from './routes/review.router.js';
import forgotPasswordRouter from './routes/forgotPassword.router.js';
import verificationRouter from './routes/verification.router.js';
import conversationRouter from './routes/conversation.router.js';
import appRouter from './routes/app.router.js';
import specialTaskRouter from './routes/specialTask.router.js';



const app  = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(cors())

app.use('/api/v1/user',userRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/tasks',taskRouter);
app.use('/api/v1/special/tasks',specialTaskRouter);
app.use('/api/v1/offers',offerRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/forgot/password',forgotPasswordRouter);
app.use('/api/v1/verifications',verificationRouter);
app.use('/api/v1/conversations',conversationRouter);
app.use('/api/v1/app',appRouter);

 
app.use(globalErrorHandle);

app.use(notFoundHandler);

export default app;