import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import UserRouter from './routes/Users.routes.js';
import TaskRouter from './routes/Tasks.routes.js';
import EmailRouter from './routes/nodemail.routes.js';
// import cookieParser from 'cookie-parser';

const app = express();

const URL1 = process.env.MODE === "DEV" ? process.env.LOCAL_URL : process.env.FRONTEND_URL
const whiteList = [URL1]

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('access denied'));
        }
    },
    credentials: true
}
// app.use(cookieParser(process.env.SIGNED_COOKIE)) // La cookie esta firmada
app.use(cors(corsOptions));
app.use(express.json());

// Conexión a la base de datos
connectDB();


// Rutas
app.use('/api/users', UserRouter);
app.use('/api/tasks', TaskRouter);
app.use('/api/email', EmailRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
