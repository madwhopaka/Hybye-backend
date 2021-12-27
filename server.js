import express from "express";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";
import username from "./routes/username.js";
import create from "./routes/create.js";
import validate from "./routes/validate.js";
import connectDb from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 8000;

// const corsOptions = {
//     origin: ['http://192.168.0.105:3000'],
// }

connectDb();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the server </h1>");
});

app.use("/api/room/create", create.router);
app.use("/api/room/validate", validate.router);
app.use("/api/username", username.router);


const server = app.listen(PORT, () => {
  console.log(`Listening to the port on localhost: ${PORT}`);
});


const io = new Server(server, {cors: {
    origin: "http://localhost:3000"
}}) ; 

io.on('connection', (socket)=> {
    console.log(socket.id) ; 

    socket.on('join-room', (data)=> {
      console.log(data, socket.id); 
      ("user joined the room") ; 
    })

    socket.on('disconnect', ()=>{
        console.log(socket.id) 
    })
})