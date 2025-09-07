import dotenv from 'dotenv';
dotenv.config();




const envsLoading = ()  =>{
       
     const properties  = ['MONGODB_URL','PORT','NODE_ENV',
        'JWT_ACCESS_TOKEN_SECRET','JWT_ACCESS_TOKEN_EXPIRESIN',
        'BCRYPT_SALT','CLOUD_NAME','CLOUD_API_KEY','CLOUD_SECRET_KEY','VERIFF_API_KEY'];

     properties.forEach((key)=>{
        
        if(!process.env[key]){
            throw new Error (`Missing env variable ${key}`)
        } 
     })
    
     return {
            PORT : process.env.PORT,
            MONGODB_URL : process.env.MONGODB_URL ,
            NODE_ENV : process.env.NODE_ENV ,
            JWT_ACCESS_TOKEN_SECRET : process.env.JWT_ACCESS_TOKEN_SECRET,
            JWT_ACCESS_TOKEN_EXPIRESIN : process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
            BCRYPT_SALT : process.env.BCRYPT_SALT,
            FIREBASE_PROJECT_ID : process.env.FIREBASE_PROJECT_ID,
            FIREBASE_PRIVATE_KEY : process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            FIREBASE_CLIENT_EMAIL : process.env.FIREBASE_CLIENT_EMAIL,
            CLOUD_NAME : process.env.CLOUD_NAME,
            CLOUD_API_KEY : process.env.CLOUD_API_KEY,
            CLOUD_SECRET_KEY : process.env.CLOUD_SECRET_KEY,
            VERIFF_API_KEY : process.env.VERIFF_API_KEY
        }
}



export const envLoader  = envsLoading();