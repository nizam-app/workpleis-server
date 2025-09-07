import bcrypt from 'bcryptjs';
import { envLoader } from "../../config/envs.js";
import AppError from "../../utils/appError.js";
import User from "./user.model.js";

const createUserService =async(payload)=>{
    const {email,password,...rest}= payload;

    const isUserExist = await User.findOne({email});

    if(isUserExist){ 
        throw new AppError(401,"User Already Exist.");
    }

    const hashPassword = await bcrypt.hash(password,Number(envLoader.BCRYPT_SALT));

    const user = await User.create({
            email,
            password : hashPassword,
            ...rest
        });

    return user;
}


const userProfileDetailsService = async(userId)=>{
    const profileDetails = await User.findById(userId).select('-password').populate('address');
    return profileDetails;
}


export const userServices = {
    createUserService,
    userProfileDetailsService
}