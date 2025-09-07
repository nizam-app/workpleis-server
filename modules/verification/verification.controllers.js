import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendResponse } from "../../utils/sendResponse.js";
import { verificationServices } from "./verification.services.js";


// send email verification code 
const sendEmailVerificationCodeController =asyncHandler(async(req,res)=>{
    const userId = req.user.id;

    const data = await verificationServices.sendEmailVerificationCodeService(userId);
    sendResponse(res,{
            statusCode : 200,
            success : true,
            message : 'Email verification code send successful',
            data : data
        }); 
});


// verify email verification
const verifyEmailVerificationController =asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const verificationCode = req.params.code;

    const data = await verificationServices.verifyEmailVerificationCodeService(userId,verificationCode);
    sendResponse(res,{
            statusCode : 200,
            success : true,
            message : 'Email verified successfully',
            data : data
        }); 
});


// send phone number verification code 
const sendPhoneVerificationCodeController =asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const {phoneNumber} = req.body;

    const data = await verificationServices.sendPhoneVerificationCodeService(userId,phoneNumber);
    sendResponse(res,{
            statusCode : 200,
            success : true,
            message : 'Phone number verification code send successful',
            data : data
        }); 
});


// verify phone number verification
const verifyPhoneNumberVerificationController =asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const verificationCode = req.params.code;

    const data = await verificationServices.verifyPhoneVerificationCodeService(userId,verificationCode);
    sendResponse(res,{
            statusCode : 200,
            success : true,
            message : 'Phone number verified successfully',
            data : data
        }); 
});

// verify identity verification
const  verifyIdentityVerificationController = asyncHandler(async (req, res) => {
 
    const userId = req.user.id;  
    const frontImage = req.files.frontImage?.[0];
    const backImage = req.files.backImage?.[0];

    const verification = await verificationServices.verifyIdentityVerificationService(userId, frontImage, backImage);
    sendResponse(res,{
                statusCode : 200,
                success : true,
                message : 'Identity verification submitted',
                data :verification.sessionId
            });
    
    
})

const identityVerificationVeriffCallbackController = async (req, res) => {
  try {
    const { verification } = req.body;

    const sessionId = verification.id;
    const status = verification.status; 
    const data = await verificationServices.verifyIdentityVerificationVeriffService(sessionId,status);
    sendResponse(res,{
                statusCode : 200,
                success : true,
                message : 'Identity verification successfull',
                data : data
            });
    
  } catch (error) {
    res.status(500).json({ error: "Callback processing failed" });
  }
};







export const verificationControllers = {
    sendEmailVerificationCodeController,
    verifyEmailVerificationController,
    sendPhoneVerificationCodeController,
    verifyPhoneNumberVerificationController,
    verifyIdentityVerificationController,
    identityVerificationVeriffCallbackController
}