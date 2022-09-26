const mongoose = require("mongoose");

//User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true, 
        unique:true,    
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    comments:[{
        book_id: {
            type: Number,
            
        }, 
        comment:[String],
    }],
    book_ratings: [{
        book_id: {
            type: Number,
            
        }, 
        rating: Number,
    }],
}, {collection : 'users_info'});

module.exports = mongoose.model("users_info", userSchema); //exporting user schema