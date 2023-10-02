import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/DEVHEAT_BETA_2GB")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model('Collection1',logInSchema)

module.exports=collection