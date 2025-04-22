const express = require('express');
let courseController = require('../controllers/course'); // Import courses data
const validations = require('../MiddleWares/errorHandler'); // Import validation rules
const userRoles = require('../utils/roles');
const verifyToken = require('../MiddleWares/verifyToken');
const allowTo = require('../MiddleWares/allowTo');




const router = express.Router();

router.route('/')
        .get(courseController.getAllCourses)
        .post(validations, courseController.createCourse);

router.route('/:id')
        .get(courseController.getSingleCourse)
        .patch(courseController.updateCourse)
        .delete(verifyToken, allowTo(userRoles.ADMIN, userRoles.MANAGER) , courseController.deleteCourse);

module.exports = router;