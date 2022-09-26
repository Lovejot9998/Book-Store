const express = require('express'); //importing express module
const app = express();
const port = 3000;

const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// milliseconds equivalent to one day
const oneday = 1000 * 60 * 60 * 24;

//session
app.use(sessions({
    secret: "gijfdgij4153osjgngkughdk4573bkgd85tbnd84efg9",
    saveUninitialized:true,
    cookie: { maxAge: oneday },
    resave: false
}));

// cookie parser
app.use(cookieParser());

const{check, validationResult} = require('express-validator');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ejs as view engine
app.set('view engine', 'ejs');

const mongoose = require("mongoose"); //importing mongoose module
const bookController = require('./Controller/bookController');
const userController = require("./Controller/userController"); //importing user controller

//Static file path
app.use(express.static(__dirname+'/Views'));

//connecting to database
mongoose.connect("mongodb://localhost:27017/Book_Store", function(err, result){
    if (err) console.log('Unexpected error ocuured while connecting to the database');
    else console.log('Connection Succesfull!');
});

//Serving static html pages-------------------------------------

//sign-up page
app.get('/signup', (req, res) => {
    var session = req.session;
    if(session.userid){
        res.redirect('/profile/user');
    }else{
        res.render('html/signup')
    }
});

//Login page
app.get('/login', (req, res) => {
    var session = req.session;
    if(session.userid){
        res.redirect('/profile/user');
    }
    else{
        res.render('html/login')
    }
});


//Serving dynamic response---------------------------------------

//homepage
app.get('/home', bookController.GetAllBooks);

//calls insert function to insert new user to database
app.post('/signup/user',[
    check('pass', 'Password must be at least 8 characters long!')
    .exists()
    .isLength({min:8}),
    check('email', 'Enter valid email address!')
    .exists()
    .isEmail()
],userController.insert);

//login request
app.post('/login/user',[
    check('email', 'Enter valid email address!')
    .exists()
    .isEmail()
],userController.Login);

//Displays user info on profile page
app.get('/profile/user', userController.GetUserById);

//request to update user
app.post('/update/user',[
    check('email', 'Enter valid email address!')
    .exists()
    .isEmail()
], userController.UpdateUserById);

//request to update user's password
app.post('/update/user/pass',[
    check('new-password', 'Password must be at least 8 characters long!')
    .exists()
    .isLength({min:8})
], userController.UpdateUserPassById);

//displays book information
app.get('/book/', bookController.GetBookById);

//search book by title
app.get('/home/search', bookController.SearchBook);

//post comment on a book
app.post('/home/book/addComment', bookController.AddComment);

//logout request
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/login');
});

//Delete request
app.get('/delete/user',userController.DeleteUserById);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))