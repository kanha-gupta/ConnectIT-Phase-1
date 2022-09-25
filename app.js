//jshint esversion:6
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const ejs= require("ejs");
const mongoose=require("mongoose");
const {mongo} = require("mongoose");

const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true})

const userschema={
    email:String,
    password:String
}
const User = new mongoose.model("User", userschema);

app.get("/", function (req,res) {
    res.redirect("/register")
})
//below for home page.Not for direct access
app.get("/redirect", function (req,res) {
   res.render("home.ejs")
})

app.get("/login",function (req, res) {
    res.render("login.ejs");
})
app.get("/register" , function (req, res) {
    res.render("register.ejs");
});
app.get("/test", function (req,res) {
    res.render("skillregistration.ejs");
})
app.get("/data/recommend.json", function (req,res) {
    res.sendFile(__dirname + "/data/recommend.json")
})

app.post("/register",function (req,res) {
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });

 newUser.save(function (err){
     if(err){
         console.log(err);
     } else {
         res.render("skillregistration.ejs");
     }
 })
})
app.post("/login", function (req, res) {
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email: username} , function (err, foundUser) {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render("home.ejs")
                }
            }
        }
    })
})
// below for skill registration page
app.post("/test", function (req, res) {
    const Studentdata = req.body;     //we can also do req.body.name but that will be lengthy so will get the full bofy og
    const filePath = __dirname+"/data/recommend.json";  //path of the file
    const fileData = fs.readFileSync(filePath);  //reading file path to get existing data
    const StoredData = JSON.parse(fileData);   //parsing the data (because before it's only a text technically)
    StoredData.push(Studentdata)    //adding new data by .push
    fs.writeFileSync(filePath,JSON.stringify(StoredData))  //now writing that data
    res.render("/redirect")
    console.log(Studentdata);
});




app.listen(3000, function () {
    console.log("server is runnin at port 3000");
});

