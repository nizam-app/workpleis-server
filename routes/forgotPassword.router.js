

import {Router} from 'express';
import { forgotPasswordControllers } from '../modules/forgot_password/forgot.controllers.js';


const forgotPasswordRouter = Router();



forgotPasswordRouter.post('/', forgotPasswordControllers.requestPasswordForgotController);
forgotPasswordRouter.post('/verify/:otp', forgotPasswordControllers.verifyPasswordForgotOtpController);
forgotPasswordRouter.put('/:otp', forgotPasswordControllers.forgotPasswordController);




export default forgotPasswordRouter;