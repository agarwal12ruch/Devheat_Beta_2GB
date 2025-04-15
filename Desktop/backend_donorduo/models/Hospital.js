const mongoose=require("mongoose");
const Patient = require("./Patient");
const {Schema}=mongoose;
const HospitalSchema=new Schema({
    name:{
        type:String
    },
    city:{
        type:String
    },
    totalCand:{
        type:Number,
        default:0
    },
    patients:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Patient"
        }
    ]
});


  
const Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;