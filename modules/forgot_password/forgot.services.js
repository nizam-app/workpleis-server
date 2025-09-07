import { envLoader } from "../../config/envs.js";
import AppError from "../../utils/appError.js";
import User from "../user/user.model.js";
import ForgotPassword from "./forgot.model.js";
import bcrypt from 'bcryptjs';



const requestPasswordResetService =async(email)=>{
    const user = await User.findOne({ email });
     
  if (!user) {
    throw new AppError(404, "User not found");
}
  if (user.isGoogle) {
    throw new AppError(400, "This account uses Google Sign-In");
}

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

// update if exists, create if not
const newRequest = await ForgotPassword.findOneAndUpdate(
    { email },
    { otp, expiresAt, verified: false },
    { upsert: true, new: true } 
  );

  // sendEmail(email, `Your reset code: ${otp}`);
  return  newRequest;
}


const verifyForgotPasswordOtpService =async( email, otp )=>{
    console.log(email,otp);
    const reset = await ForgotPassword.findOne({ email, otp });
    console.log(reset);
  if (!reset) {
    throw new AppError(400, "Invalid OTP");
}
  if (reset.expiresAt < Date.now()) {
    throw new AppError(400, "OTP expired");
}

  reset.verified = true;
  await reset.save();

  return reset;
}

const forgotPasswordService = async (email, otp, newPassword) => {
  const reset = await ForgotPassword.findOne({ email, otp, verified: true });
  if (!reset) {
    throw new AppError(400, "Invalid or unverified OTP");
}
  if (reset.expiresAt < Date.now()) {
    throw new AppError(400, "OTP expired");
}

  const user = await User.findOne({ email });
  user.password = await bcrypt.hash(newPassword, Number(envLoader.BCRYPT_SALT));
  await user.save();

  return user;
};

export const forgotPasswordServices = {
    requestPasswordResetService,
    verifyForgotPasswordOtpService,
    forgotPasswordService
}