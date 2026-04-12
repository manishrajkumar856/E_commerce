import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in .env file! Please add it before starting the server.");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT secret is missing")
}

if(!process.env.CLIENT_ID){
    throw new Error("Client Id is missing!");
}

if(!process.env.CLIENT_SECRET){
    throw new Error("Client Secret is missing!");
}


const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    CLIENT_ID : process.env.CLIENT_ID,
    CLIENT_SECRET : process.env.CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development'
}


export default config;