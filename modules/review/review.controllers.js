import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { reviewServices } from "./review.services.js";

const createReviewController = asyncHandler(async (req, res) => {
  const { to, rating, comment } = req.body;
  
  const taskId = req.params.id;
  const from = req.user.id;

  const review = await reviewServices.createReviewService(
    taskId,
    from,      
    to,
    { rating, comment }
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