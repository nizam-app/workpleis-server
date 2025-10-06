import bcrypt from 'bcryptjs';
import User from "../user/user.model.js";
import AppError from '../../utils/appError.js';
import { envLoader } from '../../config/envs.js';
import { generateToken } from '../../utils/generateToken.js';
import admin from '../../config/firebase.config.js';


const authLoginService = async(payload)=>{
    const {email,password}= payload;

    const isUserExist = await User.findOne({email});

    if(!isUserExist){ 
        throw new AppError(404,"User is not found.");
    }

    const isCorrectPassword = await bcrypt.compare(password,isUserExist.password);
   
    if(!isCorrectPassword){ 
        throw new AppError(401,"Incorrect password.");
    }

    const tokenPayload = {
        id : isUserExist._id,
        email : isUserExist.email,
        role : isUserExist.role
    }
    const token = generateToken(tokenPayload,envLoader.JWT_ACCESS_TOKEN_SECRET,envLoader.JWT_ACCESS_TOKEN_EXPIRESIN)
    
    const user = isUserExist.toObject();
    delete user.password;
    return {
        user,
        token
    };
}

// reset password service
const resetPasswordService = async(email,oldPassword,newPassword)=>{
     
    const isUserExist = await User.findOne({email});

    const isCorrectPassword = await bcrypt.compare(oldPassword,isUserExist.password);
   
    if(!isCorrectPassword){ 
        throw new AppError(401,"Old password does not match.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, Number(envLoader.BCRYPT_SALT));

    isUserExist.password = hashedPassword;
    await isUserExist.save();
}


// login user : google
const googleLoginservice = async(token)=>{
    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        avatar: picture,
        google: true,
      });
      await user.save();
    }


    const tokenPayload = {
        id : user._id,
        email : user.email,
        role : user.role
    }
    const jwtToken = generateToken(tokenPayload,envLoader.JWT_ACCESS_TOKEN_SECRET,envLoader.JWT_ACCESS_TOKEN_EXPIRESIN);

    return {
        user,
        token : jwtToken
    };
    
};


export const authServices = {
    authLoginService,
    resetPasswordService,
    googleLoginservice
}