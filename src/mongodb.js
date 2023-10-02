import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/DEVHEAT_BETA_2GB")
.then(()=>{
    console.log("mogodn connected");
})
.catch(()=>{
    console.log("failed connection");
});

const loginschema= new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("collection1",loginschema);
 
module.exports=collection;
