const express = require('express');
const app = express();
const userModel =  require("./models/user");
const bcrypt =  require("bcrypt");
const jwt  = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized:false,
    secret:"ChachaBhidhayakHaiHumare"
}));
app.use(flash());
  
app.get("/profile" ,isLoggedIn, async function(req , res){
    const token = req.cookies.token
    const decoded = jwt.verify(token , "hellow");
      
    const user = await userModel.findOne({email: decoded.email});
    
    res.render("profile" , {user});
     
})

app.get("/logout", function(req , res){
    res.cookie("token" , "");
    res.redirect("/login");
})

app.get("/login", function(req , res){
    const error = req.flash("error");
    res.render("login",{error});
})


app.get("/", function(req , res){
      res.render("index");
})

app.post("/create", function(req , res){
   var{name,username,email,password,image} =  req.body;

    bcrypt.genSalt(10 , function(err , salt){
        bcrypt.hash(password, salt , async function( err , hash){

            const user = await userModel.create({
                name,
                username,
                email,
                password:hash,
                image,
          });
            const token = jwt.sign({email , password , userId: user._id} , "hellow");
            res.cookie("token" , token);
            res.redirect("/login");
        } )
    } )

})

app.post("/login" , async function( req , res){
    const {email , password} = req.body;
    const user  =  await userModel.findOne({email});
    
    if(!user){
          req.flash("error" , "Email or password is incorrect");
    }

    bcrypt.compare(password , user.password , function( err ,result){
         if(result){
            const token = jwt.sign({email , password , userId: user._id} , "hellow");
            res.cookie("token" , token);
            res.redirect("/profile");
         }
         else{
               req.flash("error" , "incorrect email or password")
               res.redirect("/login");
         }
    } )

})

function isLoggedIn(req , res , next){
    if(req.cookies.token === "") res.redirect("/login");

    else{
        let data = jwt.verify(req.cookies.token , "hellow");
        req.user = data;
        next();
    }
}

app.listen(process.env.PORT || 3000);