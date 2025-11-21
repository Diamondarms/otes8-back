import express from "express"
import cors from 'cors';
import router from "./routes";
import dbConnect from "./db"

async function createApp(){
    const app = express()

    await dbConnect();

    app.use(cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
        optionsSuccessStatus: 200
    }));
    
    app.use(express.json());
    app.use("/", router)

    return app;
}

export default createApp;