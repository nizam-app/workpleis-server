import { v2 as cloudinary } from 'cloudinary';
import { envLoader } from "./envs.js";

// Configuration
    cloudinary.config({ 
        cloud_name: envLoader.CLOUD_NAME, 
        api_key: envLoader.CLOUD_API_KEY, 
        api_secret: envLoader.CLOUD_SECRET_KEY 
    });

export default cloudinary;