import jwt from 'jsonwebtoken';
import { envLoader } from "../config/envs.js";
import AppError from "../utils/appError.js";

export const authentication = (...roles)=>async(req  ,res ,next )=>{
    try {
        const token = req.headers.authorization;

        if(!token) throw new AppError(404, "Token not found.");
        
        const verified = jwt.verify(token,envLoader.JWT_ACCESS_TOKEN_SECRET);
        console.log(roles);
        if(!roles.includes((verified).role)){
            throw new AppError(403,"You can not view this route!")
        }
        req.user = verified;
        next()
    } catch (error) {
        next(error);
    }
}