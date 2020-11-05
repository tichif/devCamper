const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const connectDB = require('./config/db');
const bootcampsRoute = require('./routes/bootcamps');

// Load env variables
dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/bootcamps', bootcampsRoute);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`App is running in ${process.env.NODE_ENV} on port: ${PORT}`);
});

// Handle  unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server and exit process
  server.close(() => process.exit(1));
});
