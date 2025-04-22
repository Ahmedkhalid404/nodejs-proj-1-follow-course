const userRoles = require('../utils/roles');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

module.exports = (...roles)=>{
    return async (req, res, next) => { // middleware
        if(!roles.includes(req.currUser.role)){
            const error = appError.create('No permission', 403, httpStatusText.FAIL);
            return next(error);
        }
        next();
    }
}