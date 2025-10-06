import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { jobServices } from "./job.services.js";

// Create new job
const createJobController = asyncHandler(async (req, res) => {
  const clientId = req.user.id;
  console.log(req.files);
  const job = await jobServices.createJobService(req.body, clientId,req.files);
   sendResponse(res,{
           statusCode : 201,
           success : true,
           message : 'Job created',
           data : job
       });
});
// Update job
// const updatejobController = asyncHandler(async (req, res) => {
//     const jobId = req.params.id;
//     const clientId = req.user.id;
//     const job = await jobServices.updatejobService(jobId, req.body,clientId);
//     sendResponse(res,{
//            statusCode : 200,
//            success : true,
//            message : 'job updated',
//            data : job
//        });
// });

// Delete job
// const deletejobController = asyncHandler(async (req, res) => {
//     const jobId = req.params.id;
//     const clientId = req.user.id;
//     await jobServices.deletejobService(jobId,clientId );
//     sendResponse(res,{
//            statusCode : 200,
//            success : true,
//            message : 'job Deleted',
//        });
// });

// Get all jobs (admin)
const getAllJobsController = asyncHandler(async (req, res) => {
     
  const data = await jobServices.getAllJobsService(req.query);
 
   sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'All jobs retrived',
           data : data.jobs,
           meta : {
            limit : data.limit,
            page : data.page
            }
       });
});

// Get job details
const getJobDetailsController = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const data = await jobServices.getJobByIdService(jobId);
  sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'job retrived',
           data : data.job,
           meta : {applicants : data.applicants}
       });
});

// Get all jobs created by a specific client
const getjobsByClientController = asyncHandler(async (req, res) => {
  const clientId = req.user.id;
  const jobs = await jobServices.getJobsByClientService(clientId);

  sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'All jobs retrived for a specific client',
           data: jobs,
           meta : {
            count : jobs.length
           }
       });
});

// search job by job title 
const searchJobByTitleController = asyncHandler(async (req, res) => {
  const { title } = req.query;

  const data = await jobServices.searchJobByjobTitleService(title);
  sendResponse(res,{
           statusCode : 200,
           success : true,
           message : 'Searching jobs retrived',
           data: data,
           meta : {
            count : data.length
           }
       });
})


export const jobControllers ={
    createJobController,
    getAllJobsController,
    getJobDetailsController,
    getjobsByClientController,
    searchJobByTitleController
}
 

 