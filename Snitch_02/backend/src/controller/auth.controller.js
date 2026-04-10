import config from "../config/config.js";
import userModel from "../model/user.model.js";
import jwt from 'jsonwebtoken';

const sendToken = (userId, res) => {
    const token = jwt.sign({id: userId}, config.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('token', token);
}

export const registerUser = async (req, res, next) => {
    const {fullname, email, contact, password, isSeller} = req.body;

    try {
        const isExist = await userModel.findOne({
            $or: [
                {email},
                {contact},
            ]
        })

        if(isExist){
            const error = new Error('User already exist!');
            error.statusCode = 409;
            return next(error);
        }

        const user = await userModel.create({
            fullname,
            email, 
            contact,
            password,
            role: isSeller ? "seller" : "buyer"
        });
        const { password: _, ...safeUser} = user._doc;

        sendToken(user._id, res);

        return res.status(200).json({
            success: true,
            message: "User register successfully!",
            user: safeUser,
        });

    } catch (error) {
        console.log(error);
    }
}

export const loginUser = async (req, res, next) =>{
    const {email, password} = req.body;

    try {
        const user = await userModel.findOne({
            email
        }).select('+password');

        if(!user){
            const error = new Error("Invalid Credential");
            error.statusCode = 401;
            return next(error);
        }

        const isMatched = await user.comparePassword(password);
        sendToken(user._id, res);

        const {password: _, ...safeUser} = user._doc;

        return res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            user: safeUser,

        });

    } catch (error) {
        next();
    }
}