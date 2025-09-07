import AppError from "../../utils/appError.js";
import Offer from "../offer/offer.model.js";
import Task from "./task.model.js";


// Create new task
const createTaskService =async(payload,userId)=>{
    const task = await Task.create({ ...payload, createdBy: userId });
    return task;
}

// Get all tasks
const getAllTasksService = async (queries) => {
  const page = parseInt(queries.page) || 1;  
  const limit = parseInt(queries.limit) || 10;  
  const skip = (page - 1) * limit;
   
  const query = {};
  

  if (queries.location) {
    query.location = { $regex: queries.location, $options: "i" };
  }

  if (queries.projectType) {
    query.projectType = queries.projectType;
  }

  if (queries.urgency) {
    query.urgency = queries.urgency;
  }

  if (queries.category) {
    query.category = queries.category;
  }

  if (queries.minBudget || queries.maxBudget) {
    query.budget = {};
    if (queries.minBudget) query.budget.$gte = Number(queries.minBudget);
    if (queries.maxBudget) query.budget.$lte = Number(queries.maxBudget);
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // default (latest first)
  if (queries.budgetSort === "high") {
    sortOption = { budget: -1 }; // higher → lower
  } else if (queries.budgetSort === "low") {
    sortOption = { budget: 1 }; // lower → higher
  }

  const tasks = await Task.find(query)
  .skip(skip)
  .limit(limit)
  .sort(sortOption)
  .populate("createdBy", "name email");
  
  return {tasks, page,limit};
};

// Get single task by ID
const getTaskByIdService = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate("createdBy", "name email");

  if (!task) throw new AppError(404,"Task not found");

  const applicants = await Offer.find({task : taskId}).countDocuments();
   
  return {task, applicants};
};

// Update a task (only owner can update)
const updateTaskService = async (taskId, payload, userId) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },  
    payload,
    { new: true, runValidators: true }
  );

  if (!task) throw new AppError(404,"Task not found");
  return task;
};

// Delete a task (only owner can delete)
const deleteTaskService = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });

  if (!task) throw new AppError(404,"Task not found or not authorized");
  return task;
};

// Get all tasks created by a specific client
const getTasksByClientService = async (clientId) => {
  const tasks = await Task.find({ createdBy: clientId })
    .populate("assignedTo", "name email");
    return tasks;
};


// search task by task title 
const searchTaskByTaskTitleServices = async(title)=>{
  if (!title) {
    throw new AppError(400,"Search query is required")
  }

  
    const tasks = await Task.find({
     title : { $regex: title, $options: "i" }  
    });


    return  tasks;

  }




export const taskServices = {
    createTaskService,
    getAllTasksService,
    getTaskByIdService,
    updateTaskService,
    deleteTaskService,
    getTasksByClientService,
    searchTaskByTaskTitleServices
}