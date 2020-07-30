const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model("User");

const {JWT_SECRET} = require("../config/key"); //secret key
const requireLogin = require("../middleware/requireLogin");


// router.get("/protected",requireLogin,(req,res)=>{
//     res.send("HWLLO");
// })

//POST To - signup
router.post("/signup", (req,res)=>{
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        return res.status(442).json({ error : "Please enter all the fields..!!!"});
    }

    User.findOne({ email: email})
        .then((savedUser)=>{
            //if email is already registered
            if(savedUser){
                return res.status(442).json({ error : "Email already registered..!!!"});
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    //saving data to the db
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic: pic
                    })
                    user.save()
                        .then(user=>{
                            res.json({ message: "Saved to db successfully..!!" })
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                })
        })
        .catch(err=>{
            console.log(err);
        })
})

//POST To - signin
router.post("/signin", (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(442).json({ error : "Please enter all the fields..!!!"});
    }

    User.findOne({ email: email })
        .then(savedUser =>{
            //If no email id found then
            if(!savedUser){
                return res.status(442).json({ error : "Invalid EMAIL or PASSWORD..!!!"});
            }
            //comparing password comming from client with the password saved in the database // return boolean value
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        // res.json({ message: "Successfully LOGGED IN...!!!"})
                        //generating token using user_id
                        const token = jwt.sign({ _id: savedUser._id}, JWT_SECRET);

                        //sending token and user data like id,name & email of the user to FRONT END
                        const {_id, name, email, followers, following, pic} = savedUser
                        res.json({ token, user: {_id, name, email, followers, following, pic} })
                    }
                    else{
                        return res.status(442).json({ error : "Invalid EMAIL or PASSWORD..!!!"});
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
        })
})

module.exports = router;