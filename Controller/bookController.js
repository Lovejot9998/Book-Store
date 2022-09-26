const mongoose = require("mongoose");
const Book = require("../Model/booksModel");
const Comment = require("../Model/commentModel");


module.exports = {

    //method to get book by its id 
    GetBookById : function(req,res){
        var session = req.session;
        var id = parseInt(req.query.id);

        if(session.userid){
            Book.findOne({id:id},function(err,result){
                if (err) throw err;
                else res.render('html/book',{book_details:result});
            });
        }
        else{
            Book.findOne({id:id},function(err,result){
                if (err) throw err;
                else res.render('html/book',{book_details:result, msg:'disable'});
            });
        }
    },

    //method to search book
    SearchBook : function(req,res){
        var keyword = req.query.keyword;
        Book.find({title:{$regex: keyword, $options: '$i'}},function(err,result){
            if (err) throw err;
            else res.render('html/home',{search_result:result, keyword:keyword});
        });
    },

    //method to post review
    AddComment : function(req,res){
        var id = parseInt(req.body.id);
        var review = req.body.review;
        var name = req.body.name;

        Book.updateOne({id:id},{$push:{
            comments:[{
                user_name:name,
                comment:review
            }]}},function(err,result){
            if (err) throw err;
            var session = req.session;
            Comment.updateOne({book_id:id},{$push:{
                comment:[{
                    id:session.userid,
                    user_name:name,
                    comments:review,
                }]}},function(err,result){
                if (err) throw err;
                else res.redirect('/book/?id='+id);
            });
        });
    },
    GetAllBooks: function(req,res){
        var session = req.session;
        Book.find({},function(err,result){
            if (err) throw err;
            if(session.userid){
                res.render('html/home',{books:result,disable:'true'})
            }else{
                res.render('html/home',{books:result});
            }            
        });
    },
    insert: function(req,res){
        var new_book = new Book( {
            id: parseInt(req.body.id),
            title : req.body.title,
            author : req.body.author,
            ISBN: parseInt(req.body.isbn),
            publisher : req.body.publisher,
            year : parseInt(req.body.year),
            language : req.body.language,
            category : req.body.category
        });
        Book.create(new_book, function(err, result){
            if (err) throw err;
            res.redirect('html/home');
        });
    }
};