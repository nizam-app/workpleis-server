import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { specialTaskServices } from "./specialTask.services.js";


const createSpecialTaskController = asyncHandler(async (req, res) => {

    const task = await  specialTaskServices.createSpecialTaskService(req.body, req.user.id);
    sendResponse(res,{
              statusCode : 201,
              success : true,
              message : 'Special Task created',
              data : task
          });
});

const getSpecialTaskController = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const task = await specialTaskServices.getSpecialTaskService(taskId);
      sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Special Task retrived',
           data : task
       });
 
});

const getAllSpecialTasksController = asyncHandler(async (req, res) => {
  
    const data = await specialTaskServices.getAllSpecialTasksService(req.query);
     sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'All special tasks retrived',
           data : data.tasks,
           meta : {
            limit : data.limit,
            page : data.page
            }
       });
   
});

const updateSpecialTaskController = async (req, res) => {
    const taskId = req.params.id;
    const payload = req.body;
    const userId= req.user.id;
    const task = await specialTaskServices.updateSpecialTaskService(taskId, payload, userId);
     sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Special Task updated',
           data : task
       });
   
};

const deleteSpecialTaskController = async (req, res) => {
    const  taskId =req.params.id;
    const userId = req.user.id;
    await specialTaskServices.deleteSpecialTaskService(taskId, userId);
     sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Special Task Deleted',
       });
};


export const specialTaskControllers = {
    createSpecialTaskController,
    getSpecialTaskController,
    getAllSpecialTasksController,
    updateSpecialTaskController,
    deleteSpecialTaskController
}