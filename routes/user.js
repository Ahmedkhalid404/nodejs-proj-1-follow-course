const express = require('express');
const validations = require('../MiddleWares/errorHandler'); // Import validation rules
const verifyToken = require('../MiddleWares/verifyToken');
const usersController = require('../controllers/user');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

// for upload avatar

const multer = require('multer');
const diskStorage = multer.diskStorage({
        destination : function(req, file, callBack){
                console.log(file);
                callBack(null, 'uploads'); // error, folder will upload on
        },
        filename : function(req, file, callBack){
                const ext = file.mimetype.split('/')[1];
                const fileName = `user-${Date.now()}.${ext}`;
                callBack(null, fileName);
        }
});

const fileFilter = (req, file, callBack) => {
        const fileType = file.mimetype.split('/')[0];
        if(fileType === 'image'){
                return callBack(null, true);
        }
        return callBack(appError.create('you can only upload an image', 400, httpStatusText.FAIL), false);
};
const upload = multer({
        storage : diskStorage,
        fileFilter
});

const router = express.Router();

router.route('/')
        .get(verifyToken, usersController.getAllUsers);

router.route('/register')
        .post(upload.single('avatar'), usersController.register);

router.route('/login')
        .post(usersController.login);


module.exports = router;