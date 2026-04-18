import { Router } from "express";
import { getMeController, googleCallback, loginUser, registerUser } from "../controller/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";
import jwt from 'jsonwebtoken';
import passport from "passport";
import config from "../config/config.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @routes POST /api/auth/register
 * @description This routes is used to register new user.
 * @access Public
 */
authRouter.post('/register', validateRegisterUser, registerUser);


/**
 * @routes POST /api/auth/login
 * @description This routes is used to login existing user.
 * @access Public
 */
authRouter.post('/login', validateLoginUser, loginUser);

// Route to initiate Google OAuth flow
/**
 * @routes GET /api/auth/google
 * @description Thsi is used to rediredt to google pageT.
 * @access Public
 */
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


/**
 * @routes POST /api/auth/login
 * @description Goodle redirect user to this page with data
 * @access Public
 */
authRouter.get('/google/callback', 
    passport.authenticate('google', {session: false, failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"}),
    googleCallback
)



/**
 * @routes GET /api/auth/me
 * @description Get the user info
 * @access Public
 */
authRouter.get('/me', authenticateUser, getMeController);


export default authRouter;