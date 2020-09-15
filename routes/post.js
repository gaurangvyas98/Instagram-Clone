const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
const Post = mongoose.model("Post");

const requireLogin = require("../middleware/requireLogin");

//create post and save it in the database
router.post("/createpost", requireLogin, (req,res)=>{
    const {title, body, pic} = req.body

    if(!title || !body || !pic){
        return res.status(442).json({ error: "Please enter all the fields "})
    }
    //to get the current user we can use req.user as we have defined in the middleware
    req.user.password = undefined //to remove the password to get saved in the post collection 
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })

    post.save()
        .then(result=>{
            res.json({ post: result })
        })
        .catch(err=>{
            console.log(err)
        })
})

//get all the post by all the users in the db
router.get("/getallpost", requireLogin, (req,res)=>{

    // populate will populate the postedBy, means all the data in the postedBy will be displayed, before only object id was displayed
    // in the second argument display all the things we want to display, like _id and name
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt') //latest post to come on the top thats why "-"
        .then(posts=>{
            res.json({posts})
        })
        .catch(err=>{
            console.log(err)
        })
})
//get all subscribed users post
router.get("/getsubscribeduserspost", requireLogin, (req,res)=>{

    // populate will populate the postedBy, means all the data in the postedBy will be displayed, before only object id was displayed
    // in the second argument display all the things we want to display, like _id and name
    //get all the post of the,  jo user follow kr raha h unke sare post  
    Post.find({ postedBy: {$in: req.user.following }})
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt') //latest post to come on the top thats why "-"
        .then(posts=>{
            res.json({posts})
        })
        .catch(err=>{
            console.log(err)
        })
})

//all the post created by specific user
router.get("/mypost", requireLogin, (req,res)=>{
    // console.log(req.user)
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(myposts=>{
            res.json({myposts})
        })
        .catch(err=>{
            console.log(err)
        })
})

//put means update request, update likes of the post
router.put("/like", requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id} //we will be pushing id of the user into likes, we can access user using req.user
    },{
        new: true //we have to write this otherwise mongodb will give us old record, for getting new record
    }).exec((error, result) =>{
        if(error){
            return res.status(442).json({ error: error})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/unlike", requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id} //we will be pushing id of the user into likes, we can access user using req.user
    },{
        new: true //we have to write this otherwise mongodb will give us old record, for getting new record
    }).exec((error, result) =>{
        if(error){
            return res.status(442).json({ error: error})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/comment", requireLogin, (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        //we have to match that the user who requested to delete the post is equal to the user who has loggen in
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})
 
module.exports = router