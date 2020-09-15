const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const mongoose = require('mongoose');
const User = mongoose.model("User");

const {JWT_SECRET} = require("../config/key"); //secret key
const {SENDGRID_API, EMAIL} = require("../config/key")//sendgrid api key
const requireLogin = require("../middleware/requireLogin");


// "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"
//creating a transporter for sending mail
const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))
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
                            //sending welcome mail to user when he/she signup for instagram
                            transporter.sendMail({
                                from: "gaurangvyas156@gmail.com", // sender address
                                to: user.email,
                                subject: "SignUP Success ✔ ", 
                                html: "<h1>WELCOME TO INSTAGRAM BY GAURANG VYAS 🤘</h1>",  
                            })
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

//POST TO - reset password
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"gaurangvyas156@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h3>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h3>
                    `
                })
                res.json({message:"check your email"})
            })
            // <a href="${EMAIL}/reset/${token}">link</a>
        })
    })
})

//POST TO - new-password
router.post("/new-password", (req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token

    //reset Token which is in the database is equal to sentToken from the front end
    //and expireToken which is in the database is less then date.now(), if expireToken is greater that means token is expired
    User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now() }})
        .then(user=>{
            if(!user){
                return res.status(422).json({error: "Try again - Session Expired"})
            }
            //if we get the user
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = newPassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then(savedUser=>{
                    res.json({message: "New Password saved successfully...!"})
                })
            })
        }).catch(err=>{
            console.log(err)
        })
})

module.exports = router;