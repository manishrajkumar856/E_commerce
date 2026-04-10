import { Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";

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

export default authRouter;