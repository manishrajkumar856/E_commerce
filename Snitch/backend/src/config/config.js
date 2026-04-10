import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in .env file! Please add it before starting the server.");
}




const config = {
    MONGO_URI : process.env.MONGO_URI,
}


export default config;