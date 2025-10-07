import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { offerservices } from "./offer.services.js";

// Service provider submits offer
const createOfferController = asyncHandler(async (req, res) => {
const jobId = req.params.id;
const serviceProviderId = req.user.id;

  const offer = await offerservices.createOfferService(
    jobId,
    serviceProviderId,
    req.body
  );


  sendResponse(res,{
             statusCode : 201,
             success : true,
             message : 'Offer submited',
             data: offer,
         });
});

// Get offers for a jobs
const getOffersForJobController = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const offers = await offerservices.getOffersForJobService(jobId);
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

  await offerservices.acceptOfferService(offerId,clientId);

sendResponse(res,{
             statusCode : 200,
             success : true,
             message : 'Offer Accepted',
             data : null 
         });
});

// client rejects an offer
const rejectOfferController = asyncHandler(async (req, res) => {
  const offerId = req.params.id;
  const clientId = req.user.id;
  const {message} = req.body;

  await offerservices.rejectOfferService(offerId,clientId,message);

  sendResponse(res,{
             statusCode : 200,
             success : true,
             message : 'Offer rejected',
             data:  null
         });
});


export const offerControllers={
  createOfferController,
  getOffersForJobController,
  acceptOfferController,
  rejectOfferController
}