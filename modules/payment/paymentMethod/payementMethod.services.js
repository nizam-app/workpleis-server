import AppError from "../../../utils/appError.js";
import User from "../../user/user.model.js";


const addPaymentMethodService = async(userId,paymentMethodId)=>{
    if (!paymentMethodId) {
       throw new AppError(400, "Payment method ID is required");
    }
    const user = await User.findById(userId);

    // Ensure user has a Stripe Customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // 1. Verify method exists
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (!pm || pm.customer) {
      throw new AppError (404, "Invalid or already attached payment method" );
    }

    // 2. Attach payment method
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // 3. Set default
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // 4. Save in DB
    user.defaultPaymentMethod = paymentMethodId;
    await user.save();

    return {brand: pm.card.brand,
      last4: pm.card.last4,
      expMonth: pm.card.exp_month,
      expYear: pm.card.exp_year }
}


export const paymentMethodServices = {
    addPaymentMethodService
}