import createApp from "./app";

async function startServer() {
    const app = await createApp();
    
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
