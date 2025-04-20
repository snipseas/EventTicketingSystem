// middleware/errorHandler.js

class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Resource not found error
  class NotFoundError extends CustomError {
    constructor(resource) {
      super(`${resource} not found`, 404);
      this.resource = resource;
    }
  }
  
  // Insufficient tickets error
  class InsufficientTicketsError extends CustomError {
    constructor(available, requested) {
      super(`Only ${available} tickets available, but ${requested} requested`, 400);
      this.available = available;
      this.requested = requested;
    }
  }
  
  // Unauthorized access error
  class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized access') {
      super(message, 401);
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    // Default values for unexpected errors
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Handle MongoDB CastError (invalid ID format)
    if (err.name === 'CastError') {
      const message = `Invalid ${err.path}: ${err.value}`;
      err = new CustomError(message, 400);
    }
  
    // Handle MongoDB duplicate field error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `Duplicate field value (${field}). Please use another value!`;
      err = new CustomError(message, 400);
    }
  
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      err = new CustomError(message, 400);
    }
  
    // Send error response
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = {
    errorHandler,
    NotFoundError,
    InsufficientTicketsError,
    UnauthorizedError,
    CustomError
  };