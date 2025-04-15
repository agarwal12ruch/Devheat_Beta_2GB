const mongoose=require("mongoose");
const {Schema}=mongoose; //extract the schema property from mongoose object
const UserSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    verified:{
        type:Boolean
    }
});
module.exports=mongoose.model('User',UserSchema)