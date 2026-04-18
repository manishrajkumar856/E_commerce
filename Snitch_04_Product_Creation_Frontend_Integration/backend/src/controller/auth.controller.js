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

export const googleCallback = async (req, res, next) => {
    const  {id, displayName, emails, photos} = req.user;

    try {
        let user = await userModel.findOne({
            email: emails[0].value,
        });

        if(!user){
            user = await userModel.create({
                fullname: displayName,
                email: emails[0].value,
                profileUrl: photos[0].value,
                googleId: id,
            })
        }

        // Generate a JWT for the authenticated user
        const token = jwt.sign({ id: id }, config.JWT_SECRET , { expiresIn: '7h' });

        // Send the token to the client
        res.cookie("token", token);
        res.redirect('http://localhost:5173/');

    } catch (error) {
        res.redirect('http://localhost:5173/login');
    }        
}

export const getMeController = (req, res, next) => {
    try {
        const user = req.user;

        return res.status(200).json({
            success: true,
            message: "Get User successfully",
            user,
        });
    } catch (error) {
        next();
    }
}