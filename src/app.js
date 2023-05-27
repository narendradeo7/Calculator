// requiring all packages 

const express = require("express");
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

// path for the custom files 
const path = require("path");
const port = process.env.PORT || 3000;

// for static files like js and css 

const static_path = path.join(__dirname, "../public");

app.use(express.static(static_path));
// getting path for views 
const templates_path = path.join(__dirname, "../templates/views");

// settting views and partials for dynamic pages 
app.set("view engine", 'ejs');
app.set("views", templates_path);

// use of bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());




let loggedIn = false;
var useremail="";
let calculations=[];




// routes 

app.get("/", (req, res) => {
    res.render("calc",{calculations:calculations,loggedIn:loggedIn,Uname:""});

});







// working for the signup routes 

app.get("/signup",(req,res)=>{
    res.render("signup",{loggedIn:loggedIn,Uname:""});
})

// we will require bcrypt for hashing and applying salt rounds 

const bcrypt = require("bcrypt");
const saltRounds = 10;



// requiring connection to the mongodbatlas

const db = require("./connection");

// requiring user model for mongo db atlas 

const userModel = require('./UserModel');



// getting current date for timestamp 
var today = new Date();
var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;

// Handle form submission
app.post('/signup', (req, res) => {
    console.log(req.body);
    // Hash the password

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).json({
                error: 'Failed to register user'
            });
            return;
        }

        // Create a new user document
        const newUser = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            mobile: req.body.mob,
            dob: req.body.dob,
            gender: req.body.gender,
            timestamp: dateTime,
            calculations: []
        });

        // Save the user to the database
        newUser.save()
            .then(() => {
                console.log('User saved:', newUser);
                res.render("login",{loggedIn:loggedIn,Uname:"",alboxStyle: "display:block;",
                alrtmsg:"Relogin to continue"})
            })
            .catch((error) => {
                alert('Error saving user: Try again!!')
                res.status(500).json({
                    error: 'Failed to register user'
                });
            });
    });
});














//   working for login route 
var serveralboxStyle = "display:none;";
var serveralrtmsg = "";


app.get("/login",(req,res)=>{
res.render("login",{loggedIn:loggedIn,Uname:"",alboxStyle: serveralboxStyle,
alrtmsg: serveralrtmsg})
})

app.post("/login", function (req, res) {

    // getting user email and password for the authentication 
     useremail = req.body.email;
    const password = req.body.password;

    console.log("entered into login route post")
    // now we will search for the email in our database 

    userModel.findOne({
            email: useremail
        })
        .then(foundUser => {
            if (foundUser) {
                return bcrypt.compare(password, foundUser.password)
                    .then(result => {
                        if (result === true) {
                            //    if a user is found
                            
                            loggedIn=true; 
                            // Return the name and calculations of the found user as JSON in the response
                            res.render("calc",{
                                Uname: foundUser.name,
                                calculations: foundUser.calculations,loggedIn:loggedIn
                            });

                        } else {
                            serveralrtmsg = "Wrong Password !";
                            res.render("login", {
                                alboxStyle: "display:block;",
                                alrtmsg: serveralrtmsg
                            });
                        }
                    });
            } else {
                serveralrtmsg = "Invalid Credentials !";
                res.render("login", {
                    alboxStyle: "display:block;",
                    alrtmsg: serveralrtmsg
                });
            }
        })
        .catch(err => {
            console.log(err);
        });



});



// working on logout path 
app.get("/logout", function (req, res) {
    // Clear the loggedIn flag and any other relevant data
    loggedIn = false;
    useremail="";
    // Redirect to the homepage or any other desired route
    res.redirect("/");
  });


// working on calculation save 

// PUT route for /calsave
// PUT route to save calculations
app.put('/put-route', (req, res) => {
    const calcname = req.body.calcname;
const expression = req.body.expression;
const result = req.body.result;

    console.log("entered in put route"+calcname);
    // Find the user in the database based on the useremail variable
    userModel.findOne({ email: useremail })
      .then(foundUser => {
        if (foundUser) {
// Add the new calculation to the user's calculations array
foundUser.calculations.push({ calname: calcname, expression:expression, result:result });  
          // Save the updated user document
          foundUser.save()
            .then(savedCal => {
              console.log('Calculation saved:', savedCal);
              res.json(savedCal); // Return the saved user as JSON in the response
            })
            .catch(error => {
              console.error('Error saving calculation:', error);
              res.status(500).json({ error: 'Failed to save calculation' });
            });
        } else {
          console.log('User not found');
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch(error => {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Failed to find user' });
      });

  });
  


















// port

app.listen(port, () => {
    console.log("listening on port " + port);
})