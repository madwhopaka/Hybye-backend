
import express from 'express' ; 

const router = express.Router() ; 

router.post('/', (req,res)=>{
    const email = req.body.email; 
    const emailId = JSON.stringify(email); 
    var subString = emailId.substring(1,7)
    const randomNumber = Math.round((Math.random()*1000)+1); 
    const username = subString + randomNumber  ; 
    
    res.json({'username': username}); 
}); 


export default {router} ; 