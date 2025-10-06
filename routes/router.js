import { Router } from "express";
import userRouter from "../modules/user/user.router.js";
import authRouter from "../modules/auth/auth.router.js";
import jobRouter from "../modules/job/job.router.js";

export const router  = Router();


const routes = [
    {
        path : '/user',
        route : userRouter
    },
    {
        path : '/auth',
        route : authRouter
    },
    {
        path : '/jobs',
        route : jobRouter
    },
]


routes.forEach((route)=>{
    router.use(route.path, route.route);
})
