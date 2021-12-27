import express from 'express'; 
import http from 'http' ; 
import cors from 'cors' ; 
import {Server} from 'socket.io' ;


const app = express()  ;
app.use(cors()); 

const server  = http.createServer(app) ; 


const io = new Server(server, {
    cors : {
        origin: "http://localhost:3000" , 
        method: ["GET", "POST"], 
    }
})

io.on('connection', (socket)=>{
    console.log(socket.id, socket) ; 
    console.log("Socket entered") ;

    socket.on("disconnect", ()=>{
        console.log("Socket exited") ;
    })
})

server.listen(4001, ()=>{
  console.log("server is running") ; 
});