import jwt from 'jsonwebtoken';
import { envLoader } from "../config/envs.js";
import AppError from "../utils/appError.js";
import User from '../modules/user/user.model.js';

export const authentication = (...roles)=>async(req  ,res ,next )=>{
    try {
        const token = req.headers.authorization;

        if(!token) throw new AppError(404, "Token not found.");
        
        const verified = jwt.verify(token,envLoader.JWT_ACCESS_TOKEN_SECRET);
        const isUserExist = await User.findOne({email : verified.email});
        if(!isUserExist){
            throw new AppError(404, "User not found");
        }
        if(!isUserExist.isVerified){
             throw new AppError(401, `Unvarified user`);
        }
        if(isUserExist.isActive === "BLOCKED" || isUserExist.isActive === "INACTIVE"){
             throw new AppError(401, `User is ${isUserExist.isActive}`);
        }
        if(isUserExist.isDeleted){
             throw new AppError(401, `User is Deleted`);
        }
        if(!roles.includes((verified).role)){
            throw new AppError(403,"You can not view this route!");
        }
        req.user = verified;
        next()
    } catch (error) {
        next(error);
    }
}