import createError from 'http-errors';
import dbConnect from './config/dbConnect';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import userRouter from './routes/userRoute';
dotenv.config()
dbConnect()

const app = express();

const port = process.env.PORT;
const server = http.createServer(app);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json({
    limit: '10mb'
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/medly/user', userRouter);


app.use(function (err: createError.HttpError, req: express.Request, res: express.Response, _next: express.NextFunction,) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});


server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})


export default app;