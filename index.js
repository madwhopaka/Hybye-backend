import WebSocket from 'ws' ; 

const wsServer = WebSocket.Server() ; 

var wss   =  new wsServer({port:9090}) ;

wss.on('connection', function (connection) {
    console.log("User connected") ;
    connection.on('message', function(message)  {
        console.log("Got a message from a user") ; 
    });

    connection.send("Hello from the server") ;
});