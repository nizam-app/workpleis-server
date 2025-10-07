import AppError from "../../utils/appError.js";
import Job from "../job/job.model.js";
import User from "../user/user.model.js";
import Review from "./review.model.js";

const createReviewService = async (jobId,from,payload) => {
  const {rating,comment} = payload;

  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new AppError(404, "Job not found");
  }

  // Reviews only allowed in Delivered
  if (job.status !== 'Delivered') {
    throw new AppError(400, "Reviews can only be given when job is in Delivered");
  }

   // Validate users belong to job
  if (
    String(job.createdBy) !== String(from) &&
    String(job.assignedTo) !== String(from)
  ) {
    throw new AppError(403, "You are not part of this job, cannot leave a review");
  }

  // Prevent duplicate reviews
  const existingReview = await Review.findOne({ job: job._id, from});
  if (existingReview) {
    throw new AppError(400, "You have already submitted a review for this job");
  }

  let to; 

  if(from === job.createdBy){
    to = String(job.assignedTo)
  }else{
    to = String(job.createdBy)
  }

  // Create review
  const newReview = new Review({
    job: job._id,
    from: from,
    to,
    rating,
    comment
  })

   await newReview.save();


  // --- Update User's average rating (the one receiving the review) ---
  const userReviews = await Review.find({ to });

  const userAvgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
 
  await User.findByIdAndUpdate(to, { ratings: userAvgRating });

  return newReview;
};



export const reviewServices ={
    createReviewService
}
