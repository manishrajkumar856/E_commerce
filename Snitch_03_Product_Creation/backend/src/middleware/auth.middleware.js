import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import userModel from '../model/user.model.js';

export const authenticateSeller = async (req, res, next) =>{
    const token = req.cookies.token;
    if(!token){
        const error = new Error("Unauthorized User!");
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = await jwt.verify(token, config.JWT_SECRET);
        console.log(decoded);

        const user = await userModel.findById(decoded.id);
        if(!user){
            const error = new Error("Unauthorized User!");
            error.statusCode = 401;
            return next(error);
        }

        if(user.role !== 'seller'){
            const error = new Error("Forbidden!");
            error.statusCode = 403;
            return next(error);
        }

        req.user = user;
        next();
    } catch (error) {
        next();
    }
}