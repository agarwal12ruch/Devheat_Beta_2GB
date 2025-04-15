const express= require("express");
const mongoose=require("mongoose");
const connectToMongo = require('./db');
const cors=require("cors");
const path= require("path");
const port=process.env.PORT || 5000;
const app=express();
app.use(express.urlencoded({ extended: true })); // Also supports form data
app.use(cors());

app.use(express.json()) // to enable json parsing of incoming http request.
app.use("/api/donor",require("./routes/auth"))
app.use("/api/donor",require("./routes/bank"))

app.listen(port,()=>{
    console.log("server connected");
})

// Connect to MongoDB
connectToMongo();

// middlewares are just functions which perform some pre processing on your data like detail verification,etc etc