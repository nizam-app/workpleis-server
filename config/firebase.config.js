 
import admin from 'firebase-admin'; 
import { envLoader } from './envs.js';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: envLoader.FIREBASE_PROJECT_ID,
    privateKey: envLoader.FIREBASE_PRIVATE_KEY,
    clientEmail: envLoader.FIREBASE_CLIENT_EMAIL,
  }),
});

export default admin;