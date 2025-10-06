import AppError from "../../utils/appError.js";
import { uploadBufferToCloudinary } from "../../utils/uploadImages.js";
import Job from "./job.model.js";



// Create new job
const createJobService = async (payload, userId,files) => {
  console.log(files);
  const uploadResults = await Promise.all(
     files.map(file => uploadBufferToCloudinary(file.buffer, "photos"))
  );
  
      const urls = uploadResults.map(result => result.secure_url);
  
  
  const job = await Job.create({ ...payload, images : urls, createdBy: userId });
  return job;
}

// Get all jobs
const getAllJobsService = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};


  if (queries.location) {
    query.location = { $regex: queries.location, $options: "i" };
  }

  if (queries.jobType) {
    query.jobType = queries.jobType;
  }

  if (queries.category) {
    query.category = queries.category;
  }

  if (queries.minBudget || queries.maxBudget) {
    query.budget = {};
    if (queries.minBudget) query.budget.$gte = Number(queries.minBudget);
    if (queries.maxBudget) query.budget.$lte = Number(queries.maxBudget);
  }


  const jobs = await Job.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email profile");

  return { jobs, page, limit };
};

// Get job details
const getJobByIdService = async (jobId) => {
  const job = await Job.findById(jobId)
    .populate("createdBy", "name email profile");

  if (!job) throw new AppError(404, "job not found");

  const applicants = await Offer.find({ job: job._id }).countDocuments();

  return { job, applicants };
};

// Update a job (only owner can update)
// const updatejobService = async (jobId, payload, userId) => {
//   const job = await job.findOneAndUpdate(
//     { _id: jobId, createdBy: userId },  
//     payload,
//     { new: true, runValidators: true }
//   );

//   if (!job) throw new AppError(404,"job not found");
//   return job;
// };

// Delete a job (only owner can delete)
// const deletejobService = async (jobId, userId) => {
//   const job = await job.findOneAndDelete({ _id: jobId, createdBy: userId });

//   if (!job) throw new AppError(404,"job not found or not authorized");
//   return job;
// };

// Get all jobs created by a specific client
const getJobsByClientService = async (clientId) => {
  const jobs = await Job.find({ createdBy: clientId })
    .populate("assignedTo", "name email profile");
  return jobs;
};


// search job by job title 
const searchJobByjobTitleService = async (title) => {
  if (!title) {
    throw new AppError(400, "Search query is required")
  }

  const jobs = await Job.find({
    title: { $regex: title, $options: "i" }
  });

  return jobs;

}




export const jobServices = {
  createJobService,
  getAllJobsService,
  getJobByIdService,
  getJobsByClientService,
  searchJobByjobTitleService
}