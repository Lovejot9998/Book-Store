const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    book_id: {
        type : Number,
        required : true,
        unique : true,
    },
    comment: [
        {
            id:String,
            user_name:String,
            comments:String
        }
    ]
    
}, {collection : 'comments'});

module.exports = mongoose.model("comment", commentSchema);