import { body, validationResult } from 'express-validator';

export const validateResult = (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        });
    }

    next(); // ✅ IMPORTANT
};

export const validateRegisterUser = [
    body('email')
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Invalid email"),

    body('contact')
        .notEmpty()
        .withMessage('Please enter your contact number!')
        .matches(/^\d{10}$/)
        .withMessage('Contact must be 10 digits!'),

    body('fullname')
        .notEmpty()
        .withMessage('Full name should not be empty!')
        .isLength({ min: 3 })
        .withMessage('Full name must be at least 3 characters long!'),

    body('password')
        .notEmpty()
        .withMessage('Password is required!')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long!')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter!')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number!'),

    body('isSeller')
        .notEmpty()
        .withMessage("Seller should not be null")
        .isBoolean()
        .withMessage("Seller must contain boolean value"),

    validateResult
];

export const validateLoginUser = [
    body('email')
    .notEmpty()
    .withMessage("Email should not be empty")
    .isEmail()
    .withMessage("Must contain valid email."),

    body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long!')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter!')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number!'),

    validateResult
]