import bcrypt from 'bcryptjs';
import User from "../user/user.model.js";
import AppError from '../../utils/appError.js';
import { envLoader } from '../../config/envs.js';
import { generateToken } from '../../utils/generateToken.js';
import admin from '../../config/firebase.config.js';
import { generateVerificationCodeAndExpires } from '../../utils/generateCodeExpires.js';

// user login service 
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

//forgot password code send service 
const forgotPasswordCodeSendService =async(email)=>{
    const user = await User.findOne({ email });
     
  if (!user) {
    throw new AppError(404, "User not found");
}

  const {code, expiresAt} = generateVerificationCodeAndExpires();
   user.forgotPasswordVerificationCode = code;
   user.forgotPasswordVerificationExpires = expiresAt;

   await user.save();

   return  {code, expiresAt};
}
// forgot password code verification service
const forgotPasswordCodeVerificationService =async( email, code )=>{
    const user = await User.findOne({email, forgotPasswordVerificationCode : code});
     
    if (!user) {
        throw new AppError(400, "Invalid OTP");
    }
    if (user.forgotPasswordVerificationExpires < Date.now()) {
        throw new AppError(400, "OTP expired");
    }
}
//forgot password service
const forgotPasswordService = async (email, code, newPassword) => {
  const user = await User.findOne({ email, forgotPasswordVerificationCode : code});
  if (!user) {
    throw new AppError(400, "Invalid or unverified OTP");
}
  if (user.expiresAt < Date.now()) {
    throw new AppError(400, "OTP expired");
}

  user.forgotPasswordVerificationCode = '';
  user.forgotPasswordVerificationExpires = '';
  user.password = await bcrypt.hash(newPassword, Number(envLoader.BCRYPT_SALT));
  await user.save();
};







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
    forgotPasswordCodeSendService,
    forgotPasswordCodeVerificationService,
    forgotPasswordService,
    googleLoginservice
}