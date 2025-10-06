import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authServices } from "./auth.services.js";

// user login controller 
const authLoginController = asyncHandler(async(req , res)=>{
    const data = await authServices.authLoginService(req.body);

    sendResponse(res,{
        statusCode : 200,
        success : true,
        message : 'User logged in successful',
        data : data
    });
})

// reset password controller 
const resetPasswordController =asyncHandler(async(req,res)=>{
    const {email} = req.user;
    const {oldPassword,newPassword} = req.body;

     
    await authServices.resetPasswordService(email,oldPassword,newPassword);

    sendResponse(res,{
        statusCode : 200,
        success : true,
        message : 'Password reset successfull',
        data : null
    });
})

// forgot password code send controller 
const forgotPasswordCodeSendController =asyncHandler(async(req,res)=>{
    const {email} = req.body;
        
       const result = await authServices.forgotPasswordCodeSendService(email);
    
         sendResponse(res,{
                    statusCode : 200,
                    success : true,
                    message : `OTP sent by ${email}`,
                    data: {
                        email,
                        code : result.code
                    }
                });
})

// forgot password code verification controller 
const forgotPasswordCodeVerificationController = async (req,res) => {
    const {email,code} = req.body;

     await authServices.forgotPasswordCodeVerificationService(email,code);
 sendResponse(res,{
                statusCode : 200,
                success : true,
                message : 'OTP verified. You can now reset your password.',
                data: null
            });
};
// forgot password controller 
const forgotPasswordController =async(req,res)=>{
    const {email,code,newPassword} = req.body;

    await authServices.forgotPasswordService(email,code,newPassword);
    
     sendResponse(res,{
                statusCode : 200,
                success : true,
                message : 'Password reset successful.',
                data: null
            });
}




const googleLogincontroller = asyncHandler(async(req,res)=>{
    const { token } = req.body;

    const data = await authServices.googleLoginservice(token);

    sendResponse(res,{
        statusCode : 200,
        success : true,
        message : 'Google login successful.',
        data :  data
    });
})



export const authControllers ={
    authLoginController,
    resetPasswordController,
    forgotPasswordCodeSendController,
    forgotPasswordCodeVerificationController,
    forgotPasswordController,
    googleLogincontroller
}