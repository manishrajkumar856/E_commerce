import { Router } from "express";
import { googleCallback, loginUser, registerUser } from "../controller/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";
import jwt from 'jsonwebtoken';
import passport from "passport";
import config from "../config/config.js";

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
    passport.authenticate('google', {session: false}),
    googleCallback
)



export default authRouter;