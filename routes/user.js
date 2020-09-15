const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

const requireLogin = require("../middleware/requireLogin");

//First we have to find the user and then find all the post created by that user 
router.get("/user/:id", requireLogin, (req,res)=>{
    User.findOne({ _id: req.params.id})
        .select("-password") //we want all the fields but not the password
        .then(user=>{
            Post.find({postedBy: req.params.id})
                .populate("postedBy", "_id name")
                .exec((err, posts)=>{
                    if(err){
                        return res.status(422).json({ error: err})
                    }
                    res.json({user, posts})
                    //return the user and all the post he has created
                })
        })
        .catch(err=>{
            return res.status(404).json({ error: "Cannot find user"})
        })
})

// initially the followers array will be empty, we will be pushing userId of the users into that array 
// first we are updating the followers array of 2nd user by adding the userId of the person who is following that idiot(1st user)
// followId we are getting from the front-end
router.put("/follow",requireLogin, (req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        //now here we will update the(1st) user following array by pushing the userId of the person he is following(2nd)user
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
            
        },{new:true}).select("-password").then(result=>{ //removing password from sending to frontend
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })

    }
    )
})

//from frontend we will be getting unfollow id
router.put("/unfollow",requireLogin, (req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

//updating profile pic, we are getting pic from the front-end
router.put("/updatepic", requireLogin, (req,res)=>{
    User.findByIdAndUpdate( req.user._id, {$set: {pic: req.body.pic}}, {new: true}, 
        (err, result)=>{
            if(err){
                return res.status(422).json({error: "Pic cannot be posted"})
            } 
            res.json(result)  
        })
})

//route to search user in the db by email
router.post("/search-users", (req,res)=>{
    let userPattern = new RegExp("^" + req.body.query)
    User.find({email: {$regex: userPattern}})
        .select(" _id email ")
        .then(user=>{
            res.json({user: user})
        }).catch(err=>{
            console.log(err)
        })
})
module.exports = router

