import {body, param} from 'express-validator'

//These are the validations for each of the endpoints in the routes
export const createUserValidator = [
    body('name')
    .notEmpty()
    .withMessage('Name is required'),

    body('email')
    .isEmail()
    .withMessage('It has to be an valid email'),

    body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isISO8601()
    .toDate()
    .custom((value) => {
      const today = new Date();
      const age = today.getFullYear() - value.getFullYear();
      if (age < 18) {
        throw new Error('You must be at least 18 years old');
      }
      return true;
    }),

    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
]

export const updateUserValidator = [
    body('name')
    .optional()
    .notEmpty()
    .withMessage('Name is required'),

    body('email')
    .optional()
    .isEmail()
    .withMessage('It has to be an valid email'),

    body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isISO8601()
    .toDate()
    .custom((value) => {
      const today = new Date();
      const age = today.getFullYear() - value.getFullYear();
      if (age < 18) {
        throw new Error('You must be at least 18 years old');
      }
      return true;
    }),

    body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]
export const loginUserValidator = [

    body('email')
    .isEmail()
    .withMessage('It has to be an valid email'),

    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]

export const idValidator = [
    param('id')
    .isMongoId()
    .withMessage('The ID  is not valid'),
]