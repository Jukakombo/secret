//jshint esversion:6
require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyparser= require ("body-parser");
const encrypt = require('mongoose-encryption');

// console.log(process.env.SECRET);

app.set('views engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.render("home.ejs");
});

app.get("/register", function(req, res){
  res.render("register.ejs");
});

app.get("/login", function(req, res){
  res.render("login.ejs");
});

app.post("/register", function (req, res){
  const newUser= new User({
    userName:req.body.userName,
    password:req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    }else{
      res.render("secrets.ejs");
    }
});
});

app.post("/login", function(req, res){
  const userName = req.body.userName;
  const password = req.body.password;
 User.findOne({email:userName}, function(err, foundUser){
   if(err){
     console.log(err);
   }else{
     if(foundUser){
       if(foundUser.password === password){
         res.render("secrets.ejs");
       }
     }
   }
 });
});

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser:true});
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const User=new mongoose.model("User", userSchema);

userSchema.plugin(encrypt, { secret:process.env.SECRET , encryptedFields: ['password']});

app.listen(process.env.PORT |3000, function(){
  console.log("your app is running on port 3000");
});
