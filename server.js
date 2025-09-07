import mongoose from "mongoose";
import { envLoader } from "./config/envs.js";
import app from "./app.js";
import { Server } from "socket.io";
import http from 'http';
import socketConnection from "./socket/index.js";

let host = "103.145.138.112"

let server;

const socketServer = http.createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"],
  },
});

socketConnection(io);


const initServer = async()=>{
    try {
        await mongoose.connect(envLoader.MONGODB_URL);
        server = socketServer.listen(envLoader.PORT, host, ()=>{
            console.log(`Server is running at ${envLoader.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
} 

initServer();

process.on("unhandledRejection",(err)=>{
    console.log('unhandledRejection',err);

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})


process.on("uncaughtException",(err)=>{
    console.log('uncaughtException', err);

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})

process.on('SIGTERM',()=>{
    console.log('SIGTERM error');

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})

process.on('SIGINT',()=>{
    console.log('SIGINT : Stop the server gracefully...');
    
    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);

})