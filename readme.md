1  Open terminal 
      type npm init -y

2 install packages 
      npm i packagesname 

3 create app.js file 
    inside app. js file
     

     1 require express js
     const express  =  require('express')

     2 call express funtion 
     const app = express()

     3 create route 
      app.get("/" funtion( req , res){
        res.send("hello world")
      })

    4 define port
     app.listen(process.env,PORT || 3000);


       
    5 create a views folder not view 
     inside views folder create a file index.

     inside index.js file boilerplate

    6 templet engine ko set karna app.js file me 
      app.set('view engine' , "ejs");

      and send ki jaghe render karna hai pr uske ander file ka name show karna 

    7 index.ejs me ek form banao 
      jisme input lo name username email password img:url
      
      form ka action "/create" 
      method post 

    9 create models folder inside user.js
       user.js inside
       1 require mongoose
         const mongoose = require("mongoose");

       2 mongoose connect
        mongoose.connect("mongodb://127.0.0.1:27017/chachabidhaykhai");
       
       3 create schema 

         cont userSchema = mongoose.schema({
            name: string
            username: string,
            email: string,
            password: string,
            imageurl: string

         })
         
    10 model banaya
         mongoose.model("user", userSchema);
    
    11  moduls.exports 
       moduls.expots = mongoose.model("user", userSchema);
      
    
      8 create karo ek route
       1 app.post("/create" , funtion(req ,res){

        })
       2 create userModel
           create route se aaya data 
         
         var {name , usrname, email , password , imgae}  =  req.body;

       const user =     await usermodel.create({
            name,
            username,
            email,
            password,
            imgae,

         })

        jab hum await ka use karte hai ab usek nearest parent funtion me asyanc ka use karna padta hai

    13  password incrypte 
       1 password ko encrypt karne ke liye hum ek package ka use karte hai jiska name hai bcrypt

    2 ab pahle password ko salt karte hai mtlb ki password ke last me kuch extra randam word include kar deta hai 
      bcrypt.gensalt(saltRound , funtion( err , salt){

        ab password ko hash kar dete hai mtlb ki password ko encrypt kar dete hai
        bcrypt.hash(passwordName , salt , funtion( err , hash){
            password: hash;
        })
      })
    

    14 ab humko browser pr ek token set karni hai kyuki user jab login karega ko uska email or password browser pr set ho jeaga jab user dusri bar account kholega or login karega ko jab vo request bhejga to uske sath browser me token ke through data the vo sath me chipak ke aaega or hum fir sever compair kar log browser me save data or user ke dawra diya gaya data agar match ho jae to login ho jeaga 

      1 is process ko karne ke liye hum ek package ka use karte hai uska name hai 
         jsonwebtoken

     const jwt = require("jsonwebtoken");

     const token = jwt .sign({jo value save karani vo} , "scrate key");
      res.cookie(token);


    15 jab hum login ka data file kar denge or login button pr tab karenge tab request /login page par jeagi jo rount post hoga

      1 hum sabse pahle user login page aaya data nikal lenge 
      2 fir use data se user ko findOne karenge 

      const user =  await userModel.findOne({email})
        
     if(!user) return kar dena 
      res.send("something went wrong");

    3 jo use mila uske password ko compare karna log page me diye gaye password ko

    bcrypt.compare(password , user.password , funtion(err , result){
          
          yaha value true or false me data
        
        ab check karenge ko agar value true ho jaegi to to data ko browser pr save kar dena 
        if(result){
            const token  = jwt.sign({email ,password , userId: user._id})
            res.cookie("token" , token);
        }
        else{
            res.send("something went wrong");
        }
    })

    16 ab login ho jane pr profile page ko show karo 
      1 create ka profile route
      2 views folder  inside profile.ejs 
      3 profile.ejs me humko user ki sari details so karni hai name username emial and showon
      
      ab profile route me hum jo user ki or se profile route me request aai thi us me chipak ke token bhi aai hogi
      ab hum toke ko verfiy kar lenge 

      var decode  = jwt.verfiy(toke , "secret");
      if(!decode) return res.send("something went wrong");
       
      else{
       1   ab hum user ko findOne kar lenge jisse humko user ki sari information mil jaegi 
        const user  = awiat userModel.findOne(email:email.decode);
        2 ab humko user ki sari information ko profile.ejs me bhej denage
        res.render("profile" ,{user});
      }


    17 route ko protect karne ke liye hum isLoggedIn funtion ka use karte hai jisse route protect ho jate hai

     funtion isLoggedIn(){
      if(req.cookies.token === "") return res.redirect("/login");
       
       humne check kiya agar token me kuch bhi nahi hai to login page pr bhej dena 

        else{
          const data = jwt.verfiy(req.cookies.token , "secrat");
          req.user = data,
          next();
        }
     }
     18  ab hum profile route ko protect kar denge isLoggedIn funtion laga kar

     19 user ko logout karne ke liye
      1 create a route
        app.get("/logout" , funtion( req , res){
          res.cookie("token" , ""),
          res.redirect("/login");
        })