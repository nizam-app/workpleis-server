import AppError from "../../utils/appError.js";
import calculatePayment from "../../utils/calculateServiceFee.js";
import Conversation from "../conversation/conversation.model.js";
import Escrow from "../payment/escrow/escrow.model.js";
import Task from "../task/task.model.js";
import User from "../user/user.model.js";
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
  // 1. Find the offer with task + jobSeeker
  const offer = await Offer.findById(offerId).populate("task").populate("jobSeeker");
  if (!offer) throw new AppError(404, "Offer not found");

  const task = offer.task;
  if (!task) throw new AppError(404, "Associated task not found");

  // 2. Validate client owns task
  if (String(task.createdBy) !== String(clientId)) {
    throw new AppError(403, "You are not authorized to accept offers for this task");
  }

  // 3. Ensure task is still open
  if (task.status !== "open") {
    throw new AppError(400, `Cannot accept offer. Task is already '${task.status}'.`);
  }

  // 4. Validate client has Stripe customer + payment method
  const client = await User.findById(clientId);
  if (!client.stripeCustomerId || !client.defaultPaymentMethod) {
    throw new AppError(400, "Please add a valid payment method before accepting offers");
  }

  // --- 🔑 ESCROW FLOW STARTS HERE ---

  // 5. Calculate service fee & payouts
  const { clientPays, serviceFee, jobSeekerReceives } = calculatePayment(offer.amount);

  // 6. Create PaymentIntent (escrow hold)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(clientPays * 100), // cents
    currency: "usd",
    customer: client.stripeCustomerId,
    payment_method: client.defaultPaymentMethod,
    confirm: true,
    capture_method: "manual", // hold funds
    metadata: {
      taskId: task._id.toString(),
      offerId: offer._id.toString(),
      clientId: client._id.toString(),
      jobSeekerId: offer.jobSeeker._id.toString(),
      serviceFee: serviceFee.toString(),
      taskerReceives: jobSeekerReceives.toString(),
    },
  });

  // 7. Save Escrow record
  const escrow = await Escrow.create({
    task: task._id,
    offer: offer._id,
    client: client._id,
    jobSeeker: offer.jobSeeker._id,
    amount: clientPays,
    serviceFee,
    jobSeekerReceives,
    stripePaymentIntentId: paymentIntent.id,
    status: "HELD",
  });

  // 8. Update Offer + Task
  offer.status = "accepted";
  await offer.save();

  task.status = "assigned";
  task.assignedTo = offer.jobSeeker._id;
  await task.save();

  // 9. Ensure conversation exists
  const conversation = await Conversation.findOneAndUpdate(
    { task: task._id, client: task.createdBy, jobSeeker: offer.jobSeeker },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return { offer, task, escrow, conversation };
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