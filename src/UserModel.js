console.log("working on user model");

// req mongoose 

const mongoose =require("mongoose");

// creating schema for our collection on mongodb database 

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    timestamp:{
        type:String,
        required:true
    },
    calculations:[{
        calname:{
            type:String,
            required:true
        },
        expression:{
            type:String,
            required:true
        },
        result:{
            type:String,
            required:true
        }
    }]
});

// Providing schema 

const User =mongoose.model("User",userSchema);

console.log("user model created");

module.exports=User;