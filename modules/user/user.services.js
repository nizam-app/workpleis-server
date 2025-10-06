import bcrypt from 'bcryptjs';
import { envLoader } from "../../config/envs.js";
import AppError from "../../utils/appError.js";
import User from "./user.model.js";
import { generateVerificationCodeAndExpires } from '../../utils/generateCodeExpires.js';
import cloudinary from '../../config/cloudinary.config.js';
import streamifier from "streamifier";
import { uploadBufferToCloudinary } from '../../utils/uploadImages.js';

// create user and email verification
const createUserWithEmailService =async(payload)=>{
    const {email,role,subRole} = payload;
    if(role === 'ADMIN'){
            throw new AppError(403,'User role is not acceptable');
    }

    const isUserExist = await User.findOne({email});

    if(isUserExist?.isVerified){
        throw new AppError(401,"You have already a verified account with this email")
    }

    let user;
    const {code,expiresAt} = generateVerificationCodeAndExpires();
    if(isUserExist){ 
          isUserExist.emailVerificationCode = code
          isUserExist.emailVerificationExpires = expiresAt

         await isUserExist.save();
     user = isUserExist;
    }else{
        user = await User.create({
            email,
            role,
            subRole,
            emailVerificationCode : code,
            emailVerificationExpires : expiresAt
        });
    }
  
    return user;
}
const createUserWithEmalVerificationService =async(payload)=>{
    const {email,code} = payload;

    const isUserExist = await User.findOne({email, emailVerificationCode : code});
    
    if(!isUserExist){
        throw new AppError(404,"Invalid verification code!")
    }
 
    if(isUserExist.emailVerificationExpires < Date.now() ){
        throw new AppError(401,"Email verification code Expired!");
    }

    isUserExist.isVerifiedEmail = true;
    isUserExist.emailVerificationCode = '';
    isUserExist.emailVerificationExpires = '';
    await isUserExist.save();

    return isUserExist;
}

// phone verification after email verification
const createUserWithPhoneService =async(payload)=>{
    const {email,phone} = payload;

    const isUserExist = await User.findOne({email});
    if(!isUserExist){
        throw new AppError(404,"User not found")
    }
    if(!isUserExist.isVerifiedEmail){
        throw new AppError(401, "Email is not verified")
    }
     
    const {code,expiresAt} = generateVerificationCodeAndExpires();

     isUserExist.phoneNumber = phone;
     isUserExist.phoneVerificationCode = code;
     isUserExist.phoneVerificationExpires = expiresAt;

     await isUserExist.save();
  
    return isUserExist;
}
const createUserWithPhoneVerificationService =async(payload)=>{
    const {email,phone,code} = payload;

    const isUserExist = await User.findOne({
        email, phoneNumber : phone, phoneVerificationCode : code});
    
    if(!isUserExist){
        throw new AppError(401, "User not found")
    }

    if(!isUserExist.isVerifiedEmail){
        throw new AppError(401, "Email is not verified")
    }
 
    if(isUserExist.phoneVerificationExpires < Date.now() ){
        throw new AppError(401,"Phone verification code Expired!");
    }

    isUserExist.isVerifiedPhone = true;
    isUserExist.phoneVerificationCode = '';
    isUserExist.phoneVerificationExpires = '';
    await isUserExist.save();

    return isUserExist;
}

// identity verification after phone verification
const createUserWithIdentityVerificationService=async(payload,files)=>{
    const {email,phone} = payload; 
    const isUserExist = await User.findOne({email, phoneNumber : phone});
    if(!isUserExist){
        throw new AppError(401, "User not found")
    }

    if(!isUserExist.isVerifiedEmail){
        throw new AppError(401, "Email is not verified")
    }
 
    if(!isUserExist.isVerifiedPhone){
        throw new AppError(401,"Phone is not verified");
    }
     

    const uploadResults = await Promise.all(
      files.map(file => uploadBufferToCloudinary(file.buffer, "identity"))
    );

    const urls = uploadResults.map(result => result.secure_url);
    
    isUserExist.identityDocs = urls;
    await isUserExist.save();

    return urls;
}

const createUserSetPasswordService=async(payload)=>{
    const {email,phone,password,address} = payload; 
    const isUserExist = await User.findOne({email, phoneNumber : phone});
    if(!isUserExist){
        throw new AppError(401, "User not found")
    }

    if(!isUserExist.isVerifiedEmail){
        throw new AppError(401, "Email is not verified")
    }
 
    if(!isUserExist.isVerifiedPhone){
        throw new AppError(401,"Phone is not verified");
    }
    
    const hashPassword = await bcrypt.hash(password,Number(envLoader.BCRYPT_SALT));


    isUserExist.address = address;
    isUserExist.password = hashPassword;
    await isUserExist.save();
}



// const createUserService =async(payload)=>{
//     const {email,password,...rest}= payload;

//     const isUserExist = await User.findOne({email});

//     if(isUserExist){ 
//         throw new AppError(401,"User Already Exist.");
//     }

//     const hashPassword = await bcrypt.hash(password,Number(envLoader.BCRYPT_SALT));

//     const user = await User.create({
//             email,
//             password : hashPassword,
//             ...rest
//         });

//     return user;
// }


// const userProfileDetailsService = async(userId)=>{
//     const profileDetails = await User.findById(userId).select('-password').populate('address');
//     return profileDetails;
// }


export const userServices = {
    createUserWithEmailService,
    createUserWithEmalVerificationService,
    createUserWithPhoneService,
    createUserWithPhoneVerificationService,
    createUserWithIdentityVerificationService,
    createUserSetPasswordService
}