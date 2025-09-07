import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { userServices } from "./user.services.js";


const createUserController = asyncHandler(async(req , res)=>{
    const user = await userServices.createUserService(req.body);

    sendResponse(res,{
        statusCode : 201,
        success : true,
        message : 'User created',
        data : {name : user.name, email : user.email} 
    });
})


const userProfileDetailsController =asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const data = await userServices.userProfileDetailsService(userId);
     sendResponse(res,{
        statusCode : 200,
        success : true,
        message : 'User profile data retrived',
        data  
    });
})

 


export const userControllers = {
    createUserController,
    userProfileDetailsController
} 