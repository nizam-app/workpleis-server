import AppError from "../../utils/appError.js";
import Conversation from "../conversation/conversation.model.js";
import Task from "../task/task.model.js";
import Offer from "./offer.model.js";

// Submit an offer
const createOfferService = async (taskId, jobSeekerId, payload) => {

  const task = await Task.findById(taskId);

  if (!task) throw new AppError(404, "Task not found");

  // Prevent job seeker from making an offer on their own task
  if (String(task.createdBy) === String(jobSeekerId)) {
    throw new AppError(403, "You cannot make an offer on your own task");
  }

  // Allow offers only when task status is 'open'
  if (task.status !== "open") {
    throw new AppError(400, `You cannot send an offer. Task is currently '${task.status}'.`);
  }

  // Prevent duplicate offers from the same job seeker
  const existingOffer = await Offer.findOne({ task : taskId, jobSeeker : jobSeekerId });
  if (existingOffer) {
    throw new AppError(400, "You have already submitted an offer for this task.");
  }

  const offer = await Offer.create({
    task : taskId,
    jobSeeker : jobSeekerId,
    ...payload,
  });

  return offer;
};

// Get all offers for a task(only task owner can get offers)
const getOffersForTaskService = async (taskId,clientId) => {

  // Find the task
  const task = await Task.findById(taskId);
  if (!task){
     throw new AppError(404, "Task not found");
  }

  // Check if the requester is the task owner
  if (String(task.createdBy) !== String(clientId)) {
    throw new AppError(403, "You are not authorized to view offers for this task");
  }

  const offers = await Offer.find({ task : taskId })
    .populate("jobSeeker", "name email")
    .sort({ createdAt: -1 });

  return offers;
};

// Accept offer (only client can accept offer)
const acceptOfferService = async (offerId, clientId) => {
  // Find the offer
  const offer = await Offer.findById(offerId).populate("task");
  if (!offer) {
    throw new AppError(404, "Offer not found");
  }

  const task = offer.task;

  // Check if client is the owner of the task
  if (String(task.createdBy) !== String(clientId)) {
    throw new AppError(403, "You are not authorized to accept offers for this task");
  }

  // Ensure the task is still open
  if (task.status !== "open") {
    throw new AppError(400, `Cannot accept offer. Task is already '${task.status}'.`);
  }

  // Update the selected offer
  offer.status = "accepted";
  await offer.save();

  // Mark task as assigned
  task.status = "assigned";
  task.assignedTo = offer.task._id;
  await task.save();

  // Create conversation (idempotent via unique index)
  const conversation = await Conversation.findOneAndUpdate(
    { task: task._id, client: task.createdBy, jobSeeker: offer.jobSeeker },
    {},                                      
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return {offer,task,conversation};
};

// Reject offer (only client can reject an offer)
const rejectOfferService = async (offerId, clientId) => {
  const offer = await Offer.findById(offerId).populate("task");
  if (!offer) {
    throw new AppError(404, "Offer not found");
  }

  const task = offer.task;

  // Check if client owns the task
  if (String(task.createdBy) !== String(clientId)) {
    throw new AppError(403, "Not authorized to reject this offer");
  }

  // If offer already accepted, cannot reject
  if (offer.status === "accepted") {
    throw new AppError(400, "You cannot reject an already accepted offer");
  }

  // If task is no longer open, reject is not allowed
  if (task.status !== "open") {
    throw new AppError(400, `You cannot reject offers for a task that is '${task.status}'`);
  }

  // Reject the offer
  offer.status = "rejected";
  await offer.save();

  return offer;
};


export const offerservices ={
    createOfferService,
    getOffersForTaskService,
    acceptOfferService,
    rejectOfferService
}