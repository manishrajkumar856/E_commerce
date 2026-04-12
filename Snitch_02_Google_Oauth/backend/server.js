import app from "./src/app.js";
import connect_db from "./src/config/db.js";

const startServer = async ()=>{
    try {
        await connect_db();
        
        app.listen(3000, ()=>{
            console.log("Server is running on port 3000!....");
        })
    } catch (error) {
        throw new Error("Server startup failure! : "+error);
    }
}

startServer();