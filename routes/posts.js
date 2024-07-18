const mongoose = require("mongoose");
const users = require("./users");

 //mongoose.connect("mongodb://127.0.0.1:27017/postsdata");

const postSchema =new mongoose.Schema({
    imageText: {
        type: String,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Array,
        default: [],
    },
    Image: {
        type: String,
    }

})

module.exports = mongoose.model("Post", postSchema); 