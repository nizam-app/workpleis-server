import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authServices } from "./auth.services.js";


const authLoginController = asyncHandler(async(req , res)=>{
    const data = await authServices.authLoginService(req.body);

    sendResponse(res,{
        statusCode : 200,
        success : true,
        message : 'User logged in successful',
        data : data
    });
})


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
    googleLogincontroller
}