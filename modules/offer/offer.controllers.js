import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { offerservices } from "./offer.services.js";

// Job seeker submits offer
const createOfferController = asyncHandler(async (req, res) => {
const taskId = req.params.id;
const jobSeekerId = req.user.id;

  const offer = await offerservices.createOfferService(
    taskId,
    jobSeekerId,
    req.body
  );


  sendResponse(res,{
             statusCode : 201,
             success : true,
             message : 'Offer submited',
             data: offer,
         });
});

// Get all offers for a task
const getOffersForTaskController = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const clientId = req.user.id;
  const offers = await offerservices.getOffersForTaskService(taskId,clientId);
  sendResponse(res,{
              statusCode : 200,
              success : true,
              message : 'All offers retrived',
              data: offers,
              meta : {count: offers.length}
          });
  });

// client accepts an offer
const acceptOfferController = asyncHandler(async (req, res) => {
  const offerId = req.params.id;
  const clientId = req.user.id;
  const offer = await offerservices.acceptOfferService(offerId,clientId);
sendResponse(res,{
             statusCode : 200,
             success : true,
             message : 'Offer Accepted',
             data: offer,
         });
});

// client rejects an offer
const rejectOfferController = asyncHandler(async (req, res) => {
  const offerId = req.params.id;
  const clientId = req.user.id;
  const offer = await offerservices.rejectOfferService(offerId,clientId);
  sendResponse(res,{
             statusCode : 200,
             success : true,
             message : 'Offer rejected',
             data: offer,
         });
});


export const offerControllers={
  createOfferController,
  getOffersForTaskController,
  acceptOfferController,
  rejectOfferController
}