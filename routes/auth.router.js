

import {Router} from 'express';
import { authControllers } from '../modules/auth/auth.controllers.js';
import { authentication } from '../middlewares/authentication.middleware.js';


const authRouter = Router();



authRouter.post('/login',authControllers.authLoginController);
authRouter.post('/google/login',authControllers.googleLogincontroller);

authRouter.post('/check',authentication('CLIENT'),(req,res)=>{
    res.json({
        message : "you are an athorized user"
    })
});



export default authRouter;