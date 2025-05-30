/**
 * Input validation middleware using express-validator
 */
const { body, param, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      return res.status(400).render('error', {
        message: 'Validation Error',
        error: { status: 400, stack: errors.array().map(e => e.msg).join(', ') },
        title: 'Validation Error'
      });
    }
  }
  next();
};

// User validation rules
const userValidationRules = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .escape(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['student', 'admin']).withMessage('Role must be either student or admin')
];

// Product validation rules
const productValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters')
    .escape(),
  body('description')
    .trim()
    .optional()
    .escape(),
  body('price')
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price cannot be negative')
];

// ID parameter validation
const idParamValidation = [
  param('id')
    .isInt().withMessage('ID must be a number')
];

module.exports = {
  handleValidationErrors,
  userValidationRules,
  productValidationRules,
  idParamValidation
};