import express, { json } from "express";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";
import username from "./routes/username.js";
import create from "./routes/create.js";
import validate from "./routes/validate.js";  
import connectDb from "./config/db.js";
const app = express();
const PORT = process.env.PORT || 8000;


 const corsOptions = {
     origin: [process.env.ALLOWED_CLIENTS.split(',')],
 }


var colorArray = ['#c56cf0','#3ae374','#17c0eb','#7158e2','#ff4d4d','#ffaf40','#474787','#ffb142'];
const leng = colorArray.length   ; 

connectDb();
app.use(cors());
app.use(express.json(corsOptions));


app.get("/", (req, res) => {
  res.send("<h1>Welcome to the server </h1>");
});
app.use("/api/room/create", create.router);
app.use("/api/room/validate", validate.router);
app.use("/api/username", username.router);


const server = app.listen(PORT, () => {
  console.log(`Listening to the port on localhost: ${PORT}`);
});

var users = [] ; 
var colors = [] ; 
var userroom = [] ; 
var usersCount = [] ; 
var rooms = []  ;
console.log(process.env.ALLOWED_CLIENTS.split(',')) ; 
const io = new Server(server, {cors: {

    origin: [process.env.ALLOWED_CLIENTS.split(',')], 
    methods: ["GET", "POST"] 
}}) ; 


function increateCount(code) {
  if (rooms.indexOf(code)==-1)
{console.log('pushed')
  rooms.push(code) ; }

var roomNumber = rooms.indexOf(code); 
console.log(roomNumber)
var count = usersCount[roomNumber] ; 
if (count==undefined) usersCount[roomNumber] = 1 ; 
else usersCount[roomNumber]++; 
console.log(usersCount[roomNumber]);

return usersCount[roomNumber] ; 
}  

function decreaseCount(code) {
    if (rooms.indexOf(code)!=-1) {
        var roomNumber = rooms.indexOf(code); 
        var count = usersCount[roomNumber] ; 
        if (count!=undefined) usersCount[roomNumber]-- ;

        return usersCount[roomNumber]; 
    }
}



io.on('connection',(socket)=> {  
      console.log("this is done") ;  



      socket.on('join-room',(data)=> {
      users[socket.id] = data.username;   
      colors[socket.id] = colorArray[Math.floor(Math.random()*leng)];
      userroom[socket.id] = data.code ;
      const count = increateCount(userroom[socket.id]) ; 
      socket.join("room"+ userroom[socket.id]) ;  
      io.in(`room${userroom[socket.id]}`).emit('updateCount', count) ; 
      console.log(`${users[socket.id]}, joined the room${data.code}`);
      const returnData = {
        message: `${data.username} joined the chat`, 
        side :  'middle' , 
        color : '', 
        from : "server",
      }
      console.log(socket.rooms.has(`room${data.code}`)); 
      socket.to(`room${userroom[socket.id]}`).emit('others-joined',returnData) ; 
    });

    socket.on("send_message", (data) => {
      console.log(colors[socket.id]); 
      data.color = colors[socket.id]; 
      data.from = users[socket.id]; 
      console.log(data); 
      socket.to(`room${data.room}`).emit("receive_message", data);
    });
   
    
    socket.on('leaving', (payload)=> { 
      var count = decreaseCount(userroom[socket.id]); 

      console.log(usersCount); 
      const data = {
        from : 'server', 
        message: `${users[socket.id]} left the chat.`, 
        side : "middle" , 
        count: count, 
      }
      
      socket.to(`room${userroom[socket.id]}`).emit("leave", data) ;
      
      socket.leave(`room${userroom[socket.id]}`); 
     
    }); 


    socket.on('disconnect', ()=>{
      console.log("Yeh sab hua") ; 
      console.log(`room${userroom[socket.id]}`);
  
      console.log("Socket left", socket.id);  
    })
})
