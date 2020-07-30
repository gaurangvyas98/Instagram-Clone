const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    body:{
        type:String,
        require:true
    },
    photo:{
        type:String,
        require:true
    },
    likes: [{
        type: ObjectId, // likes will contain array of id of the users
        ref: "User"
    }],
    comments: [{
        text: String,
        postedBy: {
            type: ObjectId,
            ref: "User"
        }
    }],
    postedBy:{
        type: ObjectId, //id of the user who have created this post
        ref: "User" //this will refer to the User model
    }
})

mongoose.model("Post", postSchema);