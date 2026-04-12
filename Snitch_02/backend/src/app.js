import express from "express";
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from "./config/config.js";
import morgan from 'morgan';

const app = express();

// Middleware
app.use(express.urlencoded(true));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Google Auth 
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) =>{
    return done(null, profile);
}));


// Routes
app.use('/api/auth', authRouter);



// Error Handler
app.use(errorHandler);

export default app;