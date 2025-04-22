let courses = require('../models/courses');
let {validationResult} = require('express-validator');
const httpStatusText = require('../utils/httpStatusText');
const AsyncWrapper = require('../MiddleWares/AsyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = AsyncWrapper(async (req, res) => {
    const query = req.query;

    const limit = query?.limit || 1e9;
    const page  = query?.page || 1;
    const skip  = (page - 1) * limit;

    const allCourses = await courses.find({}, {
        "__v" : false
    }).skip(skip).limit(limit);
    res.json({
        status : httpStatusText.SUCCESS,
        data : {
            courses : allCourses
        }
    });
});

const getSingleCourse = AsyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const course = await courses.findById(id);
    if (!course) {
        const error = appError.create('Course not found', 404, httpStatusText.FAIL);
        return next(error);
    }

    return res.json({
        status : httpStatusText.SUCCESS,
        data : {
            course
        }
    });
});

const createCourse = AsyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
        return next(error);
    }
    const newCourse =  new courses({
        title : req.body.title,
        price : +req.body.price
    });
    // await courses.insertOne(newCourse);
    await newCourse.save();
    res.status(201).location(`/api/courses/${newCourse._id}`).json({
        status : httpStatusText.SUCCESS,
        data : {
            course : newCourse
        }
    });
})


const updateCourse = AsyncWrapper(async (req, res) => {
    const id = req.params.id;
    let updatedCourse = {
        title : req.body.title,
        price : req.body.price
    };

    updatedCourse = await courses.findOneAndUpdate({_id : id}, {$set: updatedCourse}, {new : true});
    /*
        const updatedCourse = await courses.findOneAndUpdate(
            { _id: id },
            { 
                $set: {
                    title: req.body.title,
                    price: req.body.price
                }
            },
            { new: true } // to return object after updated
        );
    */

    return res.status(200).location(`/api/courses/${updatedCourse._id}`).json({
        status : httpStatusText.SUCCESS,
        data : {
            course : updatedCourse
        }
        });
    
});


const deleteCourse = AsyncWrapper(async (req, res) => {
    const id = req.params.id;

    await courses.deleteOne({_id : id});
    res.status(200).json({
        status : httpStatusText.SUCCESS,
        data : null
    });
});



module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse
};