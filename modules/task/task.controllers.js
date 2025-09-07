import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { taskServices } from "./task.services.js";


// Create new task
const createTaskController = asyncHandler(async (req, res) => {
  const clientId = req.user.id;
  const task = await taskServices.createTaskService(req.body, clientId);
   sendResponse(res,{
           statusCode : 201,
           success : true,
           message : 'Task created',
           data : task
       });
});

// Get all tasks
const getAllTasksController = asyncHandler(async (req, res) => {
     
  const data = await taskServices.getAllTasksService(req.query);
  console.log(data);
   sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'All tasks retrived',
           data : data.tasks,
           meta : {
            limit : data.limit,
            page : data.page
            }
       });
});

// Get task details
const getTaskByIdController = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const data = await taskServices.getTaskByIdService(taskId);
  sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Task retrived',
           data : data.task,
           meta : {applicants : data.applicants}
       });
});

// Update task
const updateTaskController = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const clientId = req.user.id;
    const task = await taskServices.updateTaskService(taskId, req.body,clientId);
    sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Task updated',
           data : task
       });
});

// Delete task
const deleteTaskController = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const clientId = req.user.id;
    await taskServices.deleteTaskService(taskId,clientId );
    sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Task Deleted',
       });
});

// Get all tasks created by a specific client
const getTasksByClientController = asyncHandler(async (req, res) => {
  const clientId = req.user.id;
  const tasks = await taskServices.getTasksByClientService(clientId);

  sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'All Tasks retrived for a specific client',
           data: tasks,
           meta : {
            count : tasks.length
           }
       });
});

// search task by task title 

const searchTaskByTitleController = asyncHandler(async (req, res) => {
  const { title } = req.query;

  const data = await taskServices.searchTaskByTaskTitleServices(title);
  sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Searching tasks retrived',
           data: data,
           meta : {
            count : data.length
           }
       });
})


export const taskControllers ={
    createTaskController,
    getAllTasksController,
    getTaskByIdController,
    updateTaskController,
    deleteTaskController,
    getTasksByClientController,
    searchTaskByTitleController
    
}
 