import AppError from "../../utils/appError.js";
import SpecialTask from "./specialTask.model.js";

const createSpecialTaskService = async (data, userId) => {
    const newSpecialTask = new SpecialTask({ ...data, createdBy: userId });
    await newSpecialTask.save();
    return  newSpecialTask;
};

const getSpecialTaskService = async (taskId) => {
  const task = await SpecialTask.findById(taskId);
  if (!task) throw new AppError(404, "Special Task not found");
  return task;
};

const getAllSpecialTasksService = async (queries = {}) => {
  const page = parseInt(queries.page) || 1;  
  const limit = parseInt(queries.limit) || 10;  
  const skip = (page - 1) * limit;
   
  const query = {};

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

  const tasks = await SpecialTask.find(query)
  .skip(skip)
  .limit(limit)
  .sort(sortOption)
  .populate("createdBy", "name email");
  
  return {tasks, page,limit};
   
};

const updateSpecialTaskService = async (taskId, data, userId) => {
   const task = await SpecialTask.findOneAndUpdate(
    { _id: taskId, createdBy: userId },  
    data,
    { new: true, runValidators: true }
  );

  if (!task) throw new AppError(404,"Task not found");
  return task;
};

const deleteSpecialTaskService = async (taskId, userId) => {
    const task = await SpecialTask.findOneAndDelete({ _id: taskId, createdBy: userId });

    if (!task) throw new AppError(404,"Task not found or not authorized");
    return task;
};


export const specialTaskServices = {
    createSpecialTaskService,
    getSpecialTaskService,
    getAllSpecialTasksService,
    updateSpecialTaskService,
    deleteSpecialTaskService
}