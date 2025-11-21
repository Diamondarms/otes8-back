import express from "express"
import cors from 'cors';
import router from "./routes";

async function createApp(){
    console.log("[DEBUG] Dentro de createApp - Iniciando setup do Express");
    const app = express()

    app.use(cors()); 
    app.use(express.json());
    
    app.get("/health", (req, res) => res.send("API is alive!"));

    app.use("/", router)
    
    console.log("[DEBUG] Dentro de createApp - Setup finalizado");
    return app;
}

export default createApp;