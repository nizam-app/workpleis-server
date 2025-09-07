import { envLoader } from "../config/envs.js";
import AppError from "./appError.js";

export const globalErrorHandle = (err  , req , res , next)=>{
    let statusCode = 500;
    let message = `Something went wrong!`;

    if(err instanceof AppError){
        statusCode = err.statusCode;
        message = err.message;
    }else if(err instanceof Error){
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        status : 'Failed',
        message,
        err,
        stack : envLoader.NODE_ENV === 'development' ? err.stack : null
    })
}