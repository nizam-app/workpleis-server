import {Router} from 'express';
import { appControllers } from '../modules/app/app.controllers.js';
const appRouter = Router();



appRouter.get('/stats',appControllers.appStatsController);



export default appRouter;