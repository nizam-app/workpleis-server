import {Router} from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { specialTaskControllers } from '../modules/specialTask/specialTask.controllers.js';


const specialTaskRouter = Router();



specialTaskRouter.post('/',authentication('CLIENT'),specialTaskControllers.createSpecialTaskController);
specialTaskRouter.get('/',authentication('ADMIN','CLIENT'),specialTaskControllers.getAllSpecialTasksController);
specialTaskRouter.get('/:id',authentication('CLIENT','ADMIN'),specialTaskControllers.getSpecialTaskController);
specialTaskRouter.put('/:id',authentication('CLIENT'),specialTaskControllers.updateSpecialTaskController);
specialTaskRouter.delete('/:id',authentication('CLIENT','ADMIN'),specialTaskControllers.deleteSpecialTaskController);




export default specialTaskRouter;