import axios from "axios";
import cloudinary from "../../config/cloudinary.config.js";
import AppError from "../../utils/appError.js";
import { generateVerificationCodeAndExpires } from "../../utils/generateCodeExpires.js";
import User from "../user/user.model.js";
import { envLoader } from "../../config/envs.js";




// email verification starts here


// send email verification code 
const sendEmailVerificationCodeService = async (userId) => {
  const user = await User.findById(userId);
  if (user.isVerifiedEmail) {
    throw new AppError(400, "Email already verified");
  }

  const {code,expiresAt} = generateVerificationCodeAndExpires();
 

  user.emailVerificationCode = code;
  user.emailVerificationExpires = expiresAt;

  await user.save()

   // here verification data will send on email 

  return {email : user.email,verificationCode : code}
};

// verify email verification code 
const verifyEmailVerificationCodeService = async (userId, code) => {
    const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, "User not found");
}
  if (user.emailVerificationCode !== code) {
    throw new AppError(400, "Invalid code");
}
  if (user.emailVerificationExpires < Date.now()) {
    throw new AppError(400, "Code expired");
}


    user.isVerifiedEmail = true;
    user.emailVerificationCode = '';
    user.emailVerificationExpires = '';
    await user.save();

  return user;
};
// email verification ends here



// mobile phone verification starts here
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

//send phone verification code 
const sendPhoneVerificationCodeService = async (userId, phoneNumber) => {
    if(!phoneNumber){
        throw new AppError(400, "Phone number is required for phone number verification.");
    }
    const user = await User.findById(userId);
  if (user.isVerifiedPhone) {
    throw new AppError(400, "Phone already verified");
}

  const {code,expiresAt} = generateVerificationCodeAndExpires();
 
  user.phoneNumber = phoneNumber;
  user.phoneVerificationCode = code;
  user.phoneVerificationExpires = expiresAt;

  await user.save();

  
  return {phone : phoneNumber, verificationCode : code};
};

// verify verification phone number
const verifyPhoneVerificationCodeService = async (userId, code) => {
    const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, "User not found");
}
  if (user.phoneVerificationCode !== code) {
    throw new AppError(400, "Invalid code");
}
  if (user.phoneVerificationExpires < Date.now()) {
    throw new AppError(400, "Code expired");
}


    user.isVerifiedPhone = true;
    user.phoneVerificationCode = '';
    user.phoneVerificationExpires = '';
    await user.save();


// here is send verification on mobile phone

    return user;
};

// mobile phone verification ends here



// identity verification service
const verifyIdentityVerificationService = async (userId, frontImage, backImage) => {
  if (!frontImage || !backImage) {
    throw new AppError(400, "Both front and back images are required");
  }

  // 1. Upload to Cloudinary
  const frontUpload = await cloudinary.uploader.upload_stream({ folder: "identity" }, frontImage.buffer);
  const backUpload = await cloudinary.uploader.upload_stream({ folder: "identity" }, backImage.buffer);

  const frontImageUrl = frontUpload.secure_url;
  const backImageUrl = backUpload.secure_url;

  // 2. Call Veriff API to create verification session
  const veriffRes = await axios.post(
    "https://stationapi.veriff.com/v1/sessions",
    {
      verification: {
        callback: 'http://103.145.138.112:8000/api/v1/verifications/indentity/verify',
        person: { userId },
        document: {
          type: "ID_CARD",
          front: frontImageUrl,
          back: backImageUrl,
        },
      },
    },
    {
      headers: {
        "X-AUTH-CLIENT": envLoader.VERIFF_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const sessionId = veriffRes.data.verification.id;

  // 3. Save in DB
  const user = await User.findById(userId);
  if(!user) {
        throw new AppError(404, "User not found");
  }

  user.identitySessionId = sessionId;
  await user.save();

  return {sessionId,veriffRes };
};


const verifyIdentityVerificationVeriffService = async(sessionId,status)=>{
    if(status !=="approved"){
        throw new AppError(400,'Verification failed')
    }

    const user = await User.find({identitySessionId : sessionId});
    if(!user){
        throw new AppError(404, "User not found");
    }
    // if approved, mark user as verified
    if (status === "approved") {
       user.isVerifiedIdentity = true;
    }
    await user.save();
    return {status,user}
}





export const verificationServices = {
    sendEmailVerificationCodeService,
    verifyEmailVerificationCodeService,
    sendPhoneVerificationCodeService,
    verifyPhoneVerificationCodeService,
    verifyIdentityVerificationService,
    verifyIdentityVerificationVeriffService
}