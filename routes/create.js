import express from 'express' ;     
import roomModel from '../models/room.js' ;

const router = express.Router() ; 
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRoomCode(length) {
  
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      
    }
    result+= Math.floor(Math.random()*100) ; 
    return result;
}

router.post('/', async (req,res)=>{
console.log(req.body) ;
const username = req.body.username ; 
console.log(username) ;
const code = generateRoomCode(12) ; 
try{
    const room = await new roomModel({
        roomId: code , 
        host : username ,
        activeMembers: 0 , 
    });
   const response =   await room.save(); 
    res.send({"code" : code }) ;
}
catch(err) {
    res.send(err) ; 
}



});

export default  {router} ; 