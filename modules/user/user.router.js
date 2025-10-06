

import {Router} from 'express';
import { userControllers } from './user.controllers.js';
import { authentication } from '../../middlewares/authentication.middleware.js';
import upload from '../../config/multer.config.js';


const userRouter = Router();


// email verification
userRouter.post('/signup/send-email',userControllers.createUserWithEmailController);
userRouter.post('/signup/email-verification',userControllers.createUserWithEmailVerificationController);

// phone verification
userRouter.post('/signup/send-phone',userControllers.createUserWithPhoneController);
userRouter.post('/signup/phone-verification',userControllers.createUserWithPhoneVerificationController);

// identity verification
userRouter.post('/signup/identity-verification',upload.array('images'),userControllers.createUserIdentityVerificationController);

// set password and address
userRouter.post('/signup/set-password',userControllers.createUserSetPasswordController);


// userRouter.get('/profile',authentication('CLIENT','JOB_SEEKER','ADMIN'),userControllers.userProfileDetailsController);



export default userRouter;