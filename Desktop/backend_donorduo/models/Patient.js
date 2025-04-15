const mongoose=require("mongoose");
const Hospital = require("./Hospital");
const {Schema}=mongoose;
const PatientSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    city:{
      type:String,
        required:true
    },
    bloodGroup:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
      type:String,
    },
    certificate:{
      type:String
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,  // Use ObjectId to reference Hospital
      ref: "Hospital",
      required: true
  }
});



module.exports=mongoose.model('Patient',PatientSchema)