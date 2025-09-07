import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import Task from "../task/task.model.js";
import User from "../user/user.model.js";

const appStatsController = asyncHandler(async(req,res)=>{
    const totolTasks = await Task.countDocuments();
    const totalUser = await User.countDocuments();
    const data = {users : totalUser, tasks : totolTasks};
    sendResponse(res,{
            statusCode : 200,
            success : true,
            message : 'Retrived app stats',
            data : data
        });
})






export const appControllers ={
    appStatsController
}