import express from "express";
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.middleware.js";
const app = express();

// Middleware
app.use(express.urlencoded(true));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/auth', authRouter);



// Error Handler
app.use(errorHandler);

export default app;