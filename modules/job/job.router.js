

import {Router} from 'express';

import { authentication } from '../../middlewares/authentication.middleware.js';
import { jobControllers } from './job.controllers.js';
import upload from '../../config/multer.config.js';


const jobRouter = Router();


// create job
jobRouter.post('/',upload.array('images'),authentication('CLIENT'),jobControllers.createJobController);

// get all jobs
jobRouter.get('/',authentication('SERVICE_PROVIDER','ADMIN'),jobControllers.getAllJobsController);

// job details
jobRouter.get('/:id',authentication('CLIENT','SERVICE_PROVIDER','ADMIN'),jobControllers.getJobDetailsController);

//get my jobs
jobRouter.get('/client/my-jobs',authentication('CLIENT'),jobControllers.getjobsByClientController);

//get jobs posted by a client 
jobRouter.get('/client/all-jobs/:id',authentication('SERVICE_PROVIDER','ADMIN'),jobControllers.getJobsForClientController);

// jobRouter.get('/client/jobs/:id',authentication('CLIENT','SERVICE_PROVIDER','ADMIN'),jobControllers.);
jobRouter.get('/search/jobs',authentication('CLIENT','SERVICE_PROVIDER','ADMIN'),jobControllers.searchJobByTitleController);



// jobRouter.delete('/:id',authentication('CLIENT','ADMIN'),taskControllers.deleteTaskController);
// jobRouter.put('/:id',authentication('CLIENT'),);

export default jobRouter;