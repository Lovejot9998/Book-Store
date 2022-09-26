const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique:true,    
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    ISBN: {
        type: Number,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
    },
    language: {
        type: String,
    },
    category: [String],
    cover_path: String,
    description : String,
    comments: [
        {
            user_name: String,
            comment: String,
        }
    ]
    
}, {collection : 'Books_info'});

module.exports = mongoose.model("Books_info", bookSchema);
