import AppError from "../../utils/appError.js";
import Conversation from "../conversation/conversation.model.js";
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

  // 1. Find the offer with its task
  const offer = await Offer.findById(offerId).populate("task");
  if (!offer) {
    throw new AppError(404, "Offer not found");
  }

  const task = offer.task;
  if (!task) {
    throw new AppError(404, "Associated task not found");
  }

  // 2. Check client owns the task
  if (String(task.createdBy) !== String(clientId)) {
    throw new AppError(403, "You are not authorized to accept offers for this task");
  }

  // 3. Ensure the task is still open
  if (task.status !== "open") {
    throw new AppError(400, `Cannot accept offer. Task is already '${task.status}'.`);
  }


  // check client has stripe customer account 
  const client = await User.findById(clientId);
  if (!client.stripeCustomerId || !client.defaultPaymentMethod) {
    throw new AppError(400, "Please add a valid payment method before accepting offers");
  }

  

  // 4. Update offer and task status
  offer.status = "accepted";
  await offer.save();

  task.status = "assigned";
  task.assignedTo = offer.jobSeeker; // FIX: should be jobSeeker, not task._id
  await task.save();

  // 5. Create conversation (idempotent)
  const conversation = await Conversation.findOneAndUpdate(
    { task: task._id, client: task.createdBy, jobSeeker: offer.jobSeeker },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // --- 🔑 ESCROW FLOW STARTS HERE ---

  // 6. Calculate fees
  const { serviceFee, amountNet } = calcFees(offer.amount);

  // 7. Create PaymentIntent in Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: offer.price * 100, // Stripe uses cents
    currency: "usd",
    customer: client.stripeCustomerId, // must exist in your User model
    payment_method: client.defaultPaymentMethod, // must be attached already
    confirm: true,
    description: `Escrow for task ${task._id} and offer ${offer._id}`,
  });

  // 8. Save Escrow record
  const escrow = await Escrow.create({
    task: task._id,
    offer: offer._id,
    buyer: clientId,
    jobSeeker: offer.jobSeeker,
    currency: "usd",
    amountGross: offer.amount,
    serviceFee,
    amountNet,
    status: "HELD",
    stripePaymentIntentId: paymentIntent.id
  });


  return { offer, task, conversation, escrow };
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