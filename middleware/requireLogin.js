const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model("User");

const {JWT_SECRET} = require("../config/key");

module.exports=(req,res,next)=>{
    const {authorization} = req.headers;
    //authorization is a string which looks like "Bearer ekfjlej(a token given to user)"
    if(!authorization){
        return res.status(401).json({ error: "you must be loggin in"})
    }
    //to get the token from the authorization string we are replacing bearer with empty string
    const token = authorization.replace("Bearer ","")

    //verify that the token is same
    jwt.verify(token, JWT_SECRET , (err, payload)=>{
        if(err){
            return res.status(401).json({ error: "you must be logged in "})
        }
        //when we generated the token we assigned userid in _id and now we are destructuring _id from the payload
        const {_id} = payload
        User.findById({ _id })
            .then(userData=>{
                //all the user data is now in req.user id,name,email, password
                req.user = userData
                next() //transferring to the next middleware or execute the code further
            })
            
    })

}