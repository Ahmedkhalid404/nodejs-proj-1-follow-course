const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Auth'] || req.headers['auth'];

    if(!authHeader){
        const error = appError.create('token is required', 401, httpStatusText.FAIL);
        return next(error);
    }
    const token = authHeader.split(' ')[1];

    try{
        const currUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currUser = currUser.payload;
        next();
    }
    catch(err){
        const error = appError.create('Invalid token', 401, httpStatusText.FAIL);
        return next(error);
    }
}

module.exports = verifyToken;