import mongoose from "mongoose";
import config from "./config.js";

async function connect_db(){
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Mongo db connected!....");
    } catch (error) {
        throw new Error("Mongo Connection Failure! : "+error);
    }
}

export default connect_db;
