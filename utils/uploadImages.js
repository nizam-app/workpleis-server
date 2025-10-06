import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.config.js';
export const uploadBufferToCloudinary = (buffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);  // pipe the buffer into the stream
  });
};