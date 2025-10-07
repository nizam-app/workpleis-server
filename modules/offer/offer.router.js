

import {Router} from 'express';
import { authentication } from '../../middlewares/authentication.middleware.js';
import { offerControllers } from './offer.controllers.js';



const offerRouter = Router();


// create an offer 
offerRouter.post('/:id',authentication('SERVICE_PROVIDER'), offerControllers.createOfferController);

// get offers for a job
offerRouter.get('/:id',authentication('CLIENT','SERVICE_PROVIDER','ADMIN'),offerControllers.getOffersForJobController);

// accept offer 
offerRouter.post('/:id/accepted',authentication('CLIENT'),offerControllers.acceptOfferController);

// reject offer
offerRouter.post('/:id/rejected',authentication('CLIENT'),offerControllers.rejectOfferController);




export default offerRouter;