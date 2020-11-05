const ErrorResponse = require('../util/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for developer
  console.log(err.stack.red);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Something went wrong. Please try again!!!`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Duplicate Field Error
  if (err.code === 11000) {
    const message = 'Duplicate value field entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
