import { sendResponse } from "../../utils/sendResponse.js";
import { forgotPasswordServices } from "./forgot.services.js";

const requestPasswordForgotController = async (req,res) => {
    const {email} = req.body;
    
   const result = await forgotPasswordServices.requestPasswordResetService(email);

     sendResponse(res,{
                statusCode : 201,
                success : true,
                message : 'OTP sent to email',
                data: result
            });
};

const verifyPasswordForgotOtpController = async (req,res) => {
    const {email} = req.body;
    const {otp}= req.params;
  const result = await forgotPasswordServices.verifyForgotPasswordOtpService(email,otp);
 sendResponse(res,{
                statusCode : 200,
                success : true,
                message : 'OTP verified. You can now reset your password.',
                data: result
            });
};


const forgotPasswordController =async(req,res)=>{
    const {email,newPassword} = req.body;
    const {otp} = req.params;
    const result = await forgotPasswordServices.forgotPasswordService(email,otp,newPassword);
    

     sendResponse(res,{
                statusCode : 200,
                success : true,
                message : 'Password reset successful.',
                data: result
            });
}

export const forgotPasswordControllers = {
    requestPasswordForgotController,
    verifyPasswordForgotOtpController,
    forgotPasswordController
}

