

import {Router} from 'express';
import { authControllers } from './auth.controllers.js';
import { authentication } from '../../middlewares/authentication.middleware.js';


const authRouter = Router();



authRouter.post('/login',authControllers.authLoginController);
authRouter.post('/reset-password',authentication('CLIENT','SERVICE_PROVIDER','ADMIN'), authControllers.resetPasswordController);
authRouter.post('/forgot-password/send-code',authControllers.forgotPasswordCodeSendController);
authRouter.post('/forgot-password/verify-code',authControllers.forgotPasswordCodeVerificationController);
authRouter.put('/forgot-password',authControllers.forgotPasswordController);










authRouter.post('/google/login',authControllers.googleLogincontroller);




export default authRouter;