import express from 'express' ;     
import roomModel from '../models/room.js' ;

const router = express.Router() ; 

router.post('/', async (req,res)=>{
console.log(req.body) ;
const username = req.body.username ; 
console.log(username) ;
const code = Math.random().toString(36).slice(1) ; 
try {
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