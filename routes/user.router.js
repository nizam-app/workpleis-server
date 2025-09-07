

import {Router} from 'express';
import { userControllers } from '../modules/user/user.controllers.js';
import { authentication } from '../middlewares/authentication.middleware.js';


const userRouter = Router();



userRouter.post('/register',userControllers.createUserController);
userRouter.get('/profile',authentication('CLIENT','JOB_SEEKER','ADMIN'),userControllers.userProfileDetailsController);



export default userRouter;