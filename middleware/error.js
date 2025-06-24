const {
    NotFoundError,
    ValidationError,
    UnauthorizedError
  } = require('../utils/errors');
  
  const errorHandler = (err, req, res, next) => {
    console.error(err);
    
    let statusCode = 500;
    let message = 'Internal Server Error';
    
    if (err instanceof NotFoundError) {
      statusCode = 404;
      message = err.message;
    } else if (err instanceof ValidationError) {
      statusCode = 400;
      message = err.message;
    } else if (err instanceof UnauthorizedError) {
      statusCode = 401;
      message = err.message;
    }
    
    res.status(statusCode).json({
      error: {
        message,
        status: statusCode,
        timestamp: new Date().toISOString()
      }
    });
  };
  
  module.exports = { errorHandler };