export const sendResponse =(res, data )=>{
    return res.status(data.statusCode).json({
        status : 'Success',
        message : data.message,
        data : data.data,
        meta : data.meta
    })
}