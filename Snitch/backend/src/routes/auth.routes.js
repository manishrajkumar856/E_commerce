import { Router } from "express";
import { registerUser } from "../controller/auth.controller.js";

const authRouter = Router();

// Define your authentication routes here
authRouter.post('/register', registerUser);


export default authRouter;