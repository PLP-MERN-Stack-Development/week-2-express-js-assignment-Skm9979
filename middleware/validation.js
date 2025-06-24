const { ValidationError } = require('../utils/errors');

const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  
  if (!name || typeof name !== 'string') {
    return next(new ValidationError('Name is required and must be a string'));
  }
  
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return next(new ValidationError('Price is required and must be a positive number'));
  }
  
  if (!category || typeof category !== 'string') {
    return next(new ValidationError('Category is required and must be a string'));
  }
  
  next();
};

module.exports = { validateProduct };