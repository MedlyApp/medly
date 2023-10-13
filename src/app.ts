import createError from 'http-errors';
import dbConnect from './config/dbConnect';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // Import http module for WebSocket
import userRouter from './routes/userRoute';
import indexRouter from './routes/indexRoute';
import postRouter from './routes/postRoute';
import { Server } from 'socket.io';

dotenv.config();
dbConnect();

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(cors());

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chatMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use('/', indexRouter);
app.use('/medly/user', userRouter);
app.use('/medly/', postRouter);



app.use(function (err: createError.HttpError, req: express.Request, res: express.Response, _next: express.NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

export default app;
