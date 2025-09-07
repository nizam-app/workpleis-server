import AppError from "../../utils/appError.js";
import Task from "../task/task.model.js";
import User from "../user/user.model.js";
import Review from "./review.model.js";

const createReviewService = async (taskId, fromUserId, toUserId, payload) => {

    
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(404, "Task not found");
  }

  // Reviews only allowed in progress or completed
  if (!["in_progress", "completed"].includes(task.status)) {
    throw new AppError(400, "Reviews can only be given when task is in progress or completed");
  }

   // Validate users belong to task
  if (
    String(task.createdBy) !== String(fromUserId) &&
    String(task.assignedTo) !== String(fromUserId)
  ) {
    throw new AppError(403, "You are not part of this task, cannot leave a review");
  }

  if (
    String(task.createdBy) !== String(toUserId) &&
    String(task.assignedTo) !== String(toUserId)
  ) {
    throw new AppError(400, "The user you are reviewing is not part of this task");
  }

  if (String(fromUserId) === String(toUserId)) {
    throw new AppError(400, "You cannot review yourself");
  }

  // Prevent duplicate reviews
  const existingReview = await Review.findOne({ task: taskId, from: fromUserId });
  if (existingReview) {
    throw new AppError(400, "You have already submitted a review for this task");
  }


  // Create review
  const newReview = new Review({
    task: taskId,
    from: fromUserId,
    to: toUserId,
    ...payload,
  })

   await newReview.save();


  // --- Update User's average rating (the one receiving the review) ---
  const userReviews = await Review.find({ to: toUserId });

  const userAvgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
 
  await User.findByIdAndUpdate(toUserId, { ratings: userAvgRating });


  return newReview;
};



export const reviewServices ={
    createReviewService
}
