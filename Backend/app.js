import express from 'express';
import {router as UserRouter} from './routers/users.js';
import { router as GameRouter } from './routers/game.js'; 
import session from 'express-session';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 60 * 1000,secure: false } 
}));

app.use('/', UserRouter);
app.use('/', GameRouter);

app.listen(3000, () => {
    console.log('Server is up on port ' + 3000);
});
