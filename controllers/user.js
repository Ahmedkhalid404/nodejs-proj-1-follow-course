const users = require('../models/user');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../MiddleWares/AsyncWrapper');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/generateJWT');

const getAllUsers = asyncWrapper(async (req, res, next)=>{
    // pagination
        const limit = req.query.limit || 1e9;
        const page  = req.query.page || 1;
        const skip  = (page - 1) * limit;

    const allUsers = await users.find({}, {
        "__v" : false,
        "password" : false
    }).limit(limit).skip(skip);

    res.json({
        status : httpStatusText.SUCCESS,
        data : {
            users : allUsers
        }
    });
});

const register = asyncWrapper(async (req, res, next) => {
    console.log(req.body);
    const {firstName, lastName, email, password, role} = req.body;

    // application validation
    // and we also make database validation from model (mongoose)
    const oldUser = await users.findOne({email});
    if(oldUser){
        let error = appError.create('email already exist', 400, httpStatusText.FAIL);
        return next(error);
    }


    // password hashing
    const hashedPassword = await bcrypt.hash(password, 8);

    let newUser = new users({
        firstName,
        lastName,
        email,
        password : hashedPassword,
        role,
        avatar : req.file.filename
    });


    // generate jwt 

    const token = await generateJWT({
            email : newUser.email,
            id    : newUser._id,
            role  : newUser.role
        },
        '15m'
    );

    newUser.token = token;
    
    await newUser.save();

    res.status(201).json({
        status : httpStatusText.SUCCESS,
        data : {
            user : newUser
        }
    });
});

const login = asyncWrapper(async (req, res, next) => {
    console.log(req.body);
    const {email, password} = req.body;
    if(!email || !password) {
        let error = appError.create('Email and password are required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const user = await users.findOne({email});

    const isValid = await bcrypt.compare(password, user?.password || "123");
    if(!isValid || !user){
        let error = appError.create('Invalid email or password', 400, httpStatusText.FAIL);
        return next(error);
    }


    const token = await generateJWT({
        email : user.email,
        id : user._id,
        role : user.role
    }, '15m');

    user.token = token;

    await user.save();

    res.status(200).json({
        status : httpStatusText.SUCCESS,
        data : {
            token : token
        }
    });

});

module.exports = {
    getAllUsers,
    register,
    login
};