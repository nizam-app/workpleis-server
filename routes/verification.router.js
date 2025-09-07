import {Router} from 'express';
import upload from '../config/multer.config.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { verificationControllers } from '../modules/verification/verification.controllers.js';

const verificationRouter = Router();

verificationRouter.post('/email',authentication('CLIENT'),verificationControllers.sendEmailVerificationCodeController);
verificationRouter.post('/email/verify/:code',authentication('CLIENT'),verificationControllers.verifyEmailVerificationController);

verificationRouter.post('/phone',authentication('CLIENT'),verificationControllers.sendPhoneVerificationCodeController);
verificationRouter.post('/phone/verify/:code',authentication('CLIENT'),verificationControllers.verifyPhoneNumberVerificationController);

verificationRouter.post('/indentity',authentication('CLIENT'),upload.fields([{ name: "frontImage", maxCount: 1 }, { name: "backImage", maxCount: 1 }]),verificationControllers.verifyIdentityVerificationController);
verificationRouter.post('/indentity/verify',verificationControllers.identityVerificationVeriffCallbackController);



export default verificationRouter;