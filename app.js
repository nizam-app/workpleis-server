
import express from 'express';
import cors from 'cors';
import { globalErrorHandle } from './utils/globalErrorHandler.js';
import { notFoundHandler } from './utils/notFoundRoute.js';
import { router } from './routes/router.js';

const app  = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(cors())


app.use('/api/v1/',router);


 
app.use(globalErrorHandle);

app.use(notFoundHandler);

export default app;