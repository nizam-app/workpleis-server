import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { paymentMethodServices } from "./payementMethod.services.js";

// POST /api/v1/payments/add-method
const addPaymentMethodController = asyncHandler(async (req, res) => {

    const userId = req.user.id;  
    const { paymentMethodId } = req.body;

    const data = await paymentMethodServices.addPaymentMethodService(userId,paymentMethodId);
     
    sendResponse(res,{
            statusCode : 200,
            success : true,
            message : 'Payment method added successfully',
            data    
        });
});

export const paymentMethodControllers = {
    addPaymentMethodController
}
