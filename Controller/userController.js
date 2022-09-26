const { redirect } = require("express/lib/response");
const mongoose = require("mongoose");
const User = require("../Model/usersModel"); //mongoose.model('users_info');
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
 

module.exports = {
    //update method for user
    UpdateUserById : function(req,res){
        const errors = validationResult(req);
        var session = req.session;

        if(!errors.isEmpty()){
            const msg = errors.array();
            User.findOne({email:session.userid},function(err,results){
                if (err) throw err;
                else res.render('html/profile',{user:results, msg});
            });
        }else{
            var session = req.session;
            var first_name = req.body.first_name;
            var last_name = req.body.last_name;
            User.updateOne({email:session.userid},{$set: {
                first_name: first_name,
                last_name: last_name,
            }}, function(err,result){
                if (err) throw err;
                User.findOne({email:session.userid},function(err,results){
                    if (err) throw err;
                    else res.render('html/profile',{user:results, messages: 'Data updated succesfully!'});
                });
            });
        }
        
    },

    //delete method for user
    DeleteUserById : function(req,res){
        var session = req.session;
        User.deleteOne({email:session.userid}, function(err,result){
            if (err) throw err;
            else{
                req.session.destroy();
                res.redirect('/login');
            };
        });
    },

    //method to update user's password
    UpdateUserPassById : function(req,res){
        const errors = validationResult(req);
        var session = req.session;

        if(!errors.isEmpty()){
            const error = errors.array();
            User.findOne({email:session.userid},function(err,results){
                if (err) throw err;
                else res.render('html/profile',{user:results, error});
            });
        }
        else{
            var new_pass = req.body.new_password;
            User.updateOne({email:session.userid},{$set: {password:new_pass}}, function(err,result){
                if (err) throw err;
                User.findOne({email:session.userid},function(err,results){
                    if (err) throw err;
                    else res.render('html/profile',{user:results, message: 'Password updated succesfully!'});
                });
            });
        }
        
    },

    //method to login
    Login: function(req,res){
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const err = errors.array();
            res.render('html/login', {err});
        }else{
            var email = req.body.email;
            User.findOne({email:email},function(err,results){
                if (err) throw err;
                if(!results){
                    res.render('html/login', {msg: 'Invalid username or password!'});
                }
                if(results){
                    session = req.session;
                    session.userid = email;
                    res.redirect('/profile/user');      
                }
                 
            });
        }

        
    },

    //method to get user by its id 
    GetUserById : function(req,res){
        var session = req.session;
        if(session.userid){
            User.findOne({email:session.userid},function(err,results){
                if (err) throw err;
                else res.render('html/profile',{user:results});
            });
        }else{
            res.render('html/login');
        }
    },

    //method to insert new user
    insert: function(req,res){
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const err = errors.array();
            res.render('html/signup', {err});
        }else{
            console.log("working")
            const email = (req.body.email).toLowerCase();
            const password = req.body.pass;
            const first_name = req.body.first_name;
            const last_name = req.body.last_name;

            //checks if user already exists or not
            User.findOne({ email: email }).then(result => {
                if(result){
                res.render('html/signup', {msg: 'User already exist with this email!'});
                }
                else{
                    //if user dose not exist then create new user
                    var new_user = new User( {
                        email : email,
                        password : password,
                        first_name: first_name,
                        last_name: last_name,
                    });

                    //password hashing
                    bcrypt.genSalt(10, (err,salt)=> 
                        bcrypt.hash(new_user.password, salt, (err, hash)=>{
                            if(err) throw err;

                            new_user.password = hash;
                            User.create(new_user, function(err, result){
                                if (err) throw err;
                                session = req.session;
                                session.userid = email;
                                res.redirect('/home');
                            });
                    }))

                }
            });               
        }
        
    },
};