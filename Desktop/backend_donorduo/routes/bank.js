const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Bank = require("../models/Patient");
const Hospital = require("../models/Hospital");

dotenv.config();

const router = express.Router();
router.get("/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find({})
      .populate("patients"); // This will populate full patient documents instead of just ObjectIds
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/newhosp",async(req,res)=>{
    try{
        const {name ,city}=req.body;
        const a =  await Hospital.findOne({name})
        if(a){
          return res.status(400).json({ message: "Hospital with this name already exists." });
        }
        const hosp=new Hospital({name,city})
        hosp.save();
        res.status(200).json(hosp);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
router.post("/newdonor", async (req, res) => {
    try {
      const {
        name,
        image,
        age,
        bloodGroup,
        city,
        certificate,
        description,
        hospital: hospitalId, // this is a string name
      } = req.body;
      // console.log(hospital)
      let hospital = await Hospital.findOne({ _id: hospitalId });
  
      if (!hospital) {
        console.log("not found")
      }
  
      const donor = new Bank({
        name,
        image,
        age,
        bloodGroup,
        city,
        certificate,
        description,
        hospital: hospital._id, // link donor to hospital _id
      });
  
      await donor.save();
  
      // Update hospital's donor list and total candidate count
      hospital.totalCand += 1;
      hospital.patients = hospital.patients || [];
      hospital.patients.push(donor._id);
      await hospital.save();
  
      res.status(200).json(donor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
router.post("/register-patient", async (req, res) => {
  try {
    const {
      name,
      age,
      city,
      bloodGroup,
      description,
      image,
      certificate,
      hospitalId // this should be the _id of the Hospital (not the name)
    } = req.body;

    // Check if the hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Create a new patient linked to the hospital
    const newPatient = new Bank({
      name,
      age,
      city,
      bloodGroup,
      description,
      image,
      certificate,
      hospital: hospital._id
    });

    await newPatient.save();

    // Push patient to hospital's patients list and increment totalCand
    hospital.patients.push(newPatient._id);
    hospital.totalCand += 1;
    await hospital.save();

    res.status(201).json({ success: true, patient: newPatient, hospital });
  } catch (error) {
    console.error("Error in /register-patient:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

const sendMailToUser = async (email, res) => {
    try {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "DonorDue Blood Bank Service",
            html: `<p>We are pleased to help you. Please send your address and your requested blood unit will be delivered soon. Thank you.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
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

router.get("/ruch", async (req, res) => {
    try {
        const donors = await Bank.find({});
        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/selectdonor", async (req, res) => {
    const { email:userEmail } = req.body;
    console.log("Received req.body:", req.body);
    console.log("Received userEmail:", userEmail);
    try {
        const user = await User.findOne({ email: userEmail });
        console.log(user);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await sendMailToUser(user.email, res);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});


module.exports = router;