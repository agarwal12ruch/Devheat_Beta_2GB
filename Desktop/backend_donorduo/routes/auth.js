const express=require("express")
const router=express.Router()
const dotenv=require("dotenv")
const User=require("../models/User")
const Otp=require("../models/Otp")
const { body, validationResult } = require('express-validator');
const bcrypt=require("bcryptjs")
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
var fetchuser=require("../middleware/fetchuser.js")
const { Error } = require("mongoose")
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET_KEY;

/// nodemailer set up stufff

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD
  }
});

// ROUTE 1: create a user using postman : no login required 
// "/api/auth/newuser"
router.post("/newuser",[
    body("name","enter a valid name").isLength({min:3}),
    body("email","enter a valid email").isEmail(),
    body('password',"Password must be of 5 charactors").isLength({ min: 3 }),
],async(req, res) => {
       let success=false;
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(400).json({ success,errors: errors.array() });
         }
      // check whether user with same email exits
      try {
        let user=await User.findOne({email:req.body.email})
        if(user){
          return res.status(400).json({
            success,
            error:"User with this email already exists"
          })
        }
        // to generate a salt

      const salt=await bcrypt.genSalt(10);

      //password ecryption
      const seqp= await bcrypt.hash(req.body.password,salt)

      // create a new user
      user =await User.create({
        name: req.body.name,
        email:req.body.email,
        password:seqp ,
        verified:false, // set verified false initially
      })
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken= jwt.sign(data,JWT_SECRET);
      success=true;
        
      // requesting the user for otp verification 
     await sendotp({ _id: user._id, email: user.email }, res);

     res.json({success,userId:user._id,token:authtoken})
     //res.send(req.body);
   }
   catch(err){
     console.log(err.message);
     res.status(500).send("some error occured");
   }
     
}) 

// send otp verification email
const sendotp= async({_id,email},res)=>{ // the id and email might need to be changed
 try {
   // generate a 4 digit otp
   const otp=`${Math.floor (1000+Math.random()*9000)}`; 
   
   // otp mail body generator
   var mailoptions={
     from: process.env.USER_EMAIL,
     to: email,
     subject: "Verify your email",
     html: `<p>Enter this otp <b>${otp}</b> in the application for verification of your account.<p>This code will expire in one hour. </p></p>` // html body
   }

   // hash the otp.
   const saltt=await bcrypt.genSalt(10);
   const hashotp= await bcrypt.hash(otp,saltt);
   // create the user id with the otp;
   userotp =await Otp.create({
     userId: _id,
     otp:hashotp,
      
   })

   /// send mail
   transporter.sendMail(mailoptions, (error, info) => {
     if (error) {
       console.error(error);
       return res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
     } else {
       console.log(info.response);
       return res.status(200).json({ success: true, message: "Email sent successfully" });
     }
   });
 } catch (error) {
   console.error(error.message);
   res.status(500).json({ success: false, message: "Internal server error", error: error.message });
 }
};


// verify the otp  at /verifyotp

router.post("/verifyotp",async(req,res)=>{
   try {
     let {userId,otp}=req.body;  // req the credentials
     if(!userId||!otp){
       throw Error("empty otp details are not allowed")
     }
     else{
       const verfiyotp= await Otp.find({userId,}); // it will find the user in the database my id
       if(verfiyotp.length<=0){
           throw Error("account record exist or its already verified, pls signup or login");
       }
       else{
           // use that the otp is not a expired otp
             const {expiresat} = verfiyotp[0];          //destructuring  and fetching from array
             const hashedotp= verfiyotp[0].otp;
             if(expiresat<Date.now){             // the otp has expires already
                 await Otp.deleteMany({userId}); //delete the generated otp
                 throw Error("Code has expired");
             }
             else{
               const validotp =await bcrypt.compare(otp,hashedotp);  // this will return a boolean value
               if(!validotp){
                 throw Error("the otp is not valid, enter correct otp");
               }
               else{
                await User.updateOne({_id:userId},{verified:true});      // the verified was false initially , if the otp is correct set it true.
                await Otp.deleteMany({userId});
                res.status(201).json("user verified successfully")
               }
             }
       }
     }

   } catch (error) {
     console.error(error.message);
     res.status(500).json({ success: false, message: "Internal server error in otp verification", error: error.message });
   }
})

/// Route 3- login---

router.post("/login",[
 body("email","enter a valid email").isEmail(),  // check user through email and password
 body('password',"enter password").exists(),
],async(req, res) => {
     // Finds the validation errors in this request and wraps them in an object with handy functions
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
      }
   const {email,password}=req.body;
   try{
     let user= await User.findOne({email})
     let success=false;
     if(!user){
       success=false;
       return res.status(400).send({error:"Please login with valid credentials"})
     }
     const passwordCompare= await bcrypt.compare(password,user.password);
     if(!passwordCompare){
       success=false;
       return res.json({success,error:"Please login with valid credentials"})
     }
     if (!user.verified) {
       return res.status(400).json({ success, error: "Please complete your verification" });
     }
     const data={
       user:{
         id:user.id
       }
     }
     const authtoken=jwt.sign(data, JWT_SECRET);
     success=true;
     res.json({success,token:authtoken})
     }
   catch(error){
     res.status(500).send("Internal server error")
   }
})


// // ROUTE : 3 fetch user details by POST: /api/auth/getuser

router.post("/getuser",fetchuser,async(req, res) => {
 try{
     const userId=req.user.id;
     const user=await User.findById(userId).select("-password");
     res.send(user);
 }
 catch(error){
   res.status(500).send("Internal server error")
 }
 })
 


module.exports=router