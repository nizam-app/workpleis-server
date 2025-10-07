import AppError from "../../utils/appError.js";
import Job from "../job/job.model.js";
import Offer from "./offer.model.js";

// Submit an offer
const createOfferService = async (jobId, serviceProviderId, payload) => {
  const job = await Job.findById(jobId);

  if (!job) throw new AppError(404, "Job not found");

  // Allow offers only when task status is 'open'
  if (job.status !== "Open") {
    throw new AppError(400, `You cannot send an offer. Job status is currently '${task.status}'.`);
  }

  const offer = await Offer.create({
    job : job._id,
    serviceProvider : serviceProviderId,
    ...payload,
  });

  return offer;
};

// Get offers for a job
const getOffersForJobService = async (jobId) => {

  // Find the job
  const job = await Job.findById(jobId);
  if (!job){
     throw new AppError(404, "Job not found");
  }

  const offers = await Offer.find({ job : jobId })
    .populate("serviceProvider", "name email profile")
    .sort({ createdAt: -1 });

  return offers;
};

// Accept offer (only client can accept offer)
const acceptOfferService = async (offerId, clientId) => {
  // Find the offer
  const offer = await Offer.findById(offerId).populate("job");
   
  if (!offer) {
    throw new AppError(404, "Offer not found");
  }

  const job = offer.job;

// Check if client owns the task
  if (String(job.createdBy) !== String(clientId)) {
    throw new AppError(401, "You are Not authorized to accept this offer");
  }

  // Ensure the task is still open
  if (job.status !== "Open") {
    throw new AppError(400, `Cannot accept offer. Job is already '${job.status}'.`);
  }

  // Update the selected offer
  offer.status = "Accepted";
  await offer.save();
   
  // Mark job as Assigned
  job.status = "Assigned";
  job.assignedTo = offer.serviceProvider;
  await job.save();
};

// Reject offer (only client can reject an offer)
const rejectOfferService = async (offerId, clientId,message) => {
  // Find the offer
  const offer = await Offer.findById(offerId).populate("job");
   
  if (!offer) {
    throw new AppError(404, "Offer not found");
  }

  const job = offer.job;

// Check if client owns the job
  if (String(job.createdBy) !== String(clientId)) {
    throw new AppError(401, "You are Not authorized to reject this offer");
  }

  // Ensure the job is still open
  if (job.status !== "Open") {
    throw new AppError(400, `Cannot accept offer. Job is already '${job.status}'.`);
  }

  // Update the selected offer
  offer.status = "Rejected";
  offer.rejectionmessage = message;
  await offer.save();
};


export const offerservices ={
    createOfferService,
    getOffersForJobService,
    acceptOfferService,
    rejectOfferService
}