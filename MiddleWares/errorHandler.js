const {body} = require('express-validator');

const validations = [
    body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({min: 3, max: 100})
        .withMessage('Title must be between 3 and 100 characters'),
    body('price')
        .isNumeric()
        .withMessage('Price must be number')
        .isFloat({gt: 0})
        .withMessage('Price must be a positive number'),
];

module.exports = validations;