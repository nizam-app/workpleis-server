import { Router } from "express";
import { reviewControllers } from "./review.controllers.js";
import { authentication } from "../../middlewares/authentication.middleware.js";



const reviewRouter = Router();


//create review 
reviewRouter.post('/:id',authentication('SERVICE_PROVIDER','CLIENT','ADMIN'), reviewControllers.createReviewController);




export default reviewRouter;