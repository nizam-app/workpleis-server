

import {Router} from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { offerControllers } from '../modules/offer/offer.controllers.js';


const offerRouter = Router();



offerRouter.post('/:id',authentication('JOB_SEEKER'), offerControllers.createOfferController);
offerRouter.get('/:id',authentication('CLIENT'),offerControllers.getOffersForTaskController);
offerRouter.post('/:id/accept',authentication('CLIENT'),offerControllers.acceptOfferController);
offerRouter.post('/:id/reject',authentication('CLIENT'),offerControllers.rejectOfferController);




export default offerRouter;