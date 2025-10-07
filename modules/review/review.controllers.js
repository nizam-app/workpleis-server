import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { reviewServices } from "./review.services.js";


// create review 
const createReviewController = asyncHandler(async (req, res) => {
  
  const jobId = req.params.id;
  const from = req.user.id;

  const review = await reviewServices.createReviewService(
    jobId,
    from,      
    req.body
  );
  
sendResponse(res,{
           statusCode : 201,
           success : true,
           message : 'Review submited',
           data : review
       });
   
});



export const  reviewControllers = {
    createReviewController
}