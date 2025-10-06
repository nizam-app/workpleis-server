import {Router} from 'express';
import { appControllers } from './app.controllers.js';
const appRouter = Router();



appRouter.get('/stats',appControllers.appStatsController);



export default appRouter;