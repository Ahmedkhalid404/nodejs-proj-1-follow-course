const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/roles');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : [true, "User already exist."],
        required : true,
        validate : [ validator.isEmail, 'this field must be a valid email address']
    },
    password :{
        type : String,
        required : true
    },
    token : {
        type : String
    },
    role : {
        type : String,
        enum : [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
        default : userRoles.USER
    },
    avatar : {
        type : String,
        default : 'uploads/default.png'
    }
},{strict : "throw"});


module.exports = mongoose.model('User', userSchema);