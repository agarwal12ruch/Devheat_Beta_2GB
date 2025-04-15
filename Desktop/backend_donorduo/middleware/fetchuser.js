var jwt = require('jsonwebtoken');
const dotenv=require("dotenv");
dotenv.config();
// const JWT_SECRET=process.env.JWT_SECRET_KEY;
const JWT_SECRET=process.env.JWT_SECRET_KEY;
const fetchuser=(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token){
        res.status(401).send("Pls authenticate using a valid token")
    }
    // if token exists it may be valid or not valid
    try {
        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user; // we will get our user
        next();
    } catch (error) {
        onsole.log(error)
        res.status(401).send("pls authenticate using a valid token")    
    }
}
module.exports=fetchuser;


// next basically points to our route
// next function should be called to end the req and to send a response and to call the next routes
// return res.end() is used to end a req response cycle. it can be called at any middle ware at which we want to want to emd that cyle