import { Router } from "express";
import { reviewControllers } from "./review.controllers.js";
import { authentication } from "../../middlewares/authentication.middleware.js";



const reviewRouter = Router();



reviewRouter.post('/:id',authentication('JOB_SEEKER','CLIENT'), reviewControllers.createReviewController);




export default reviewRouter;