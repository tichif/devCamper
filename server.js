const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const bootcampsRoute = require('./routes/bootcamps');
const coursesRoute = require('./routes/courses');
const authRoute = require('./routes/auth');

// Load env variables
dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
// Body Parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/bootcamps', bootcampsRoute);
app.use('/api/v1/courses', coursesRoute);
app.use('/api/v1/auth', authRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `App is running in ${process.env.NODE_ENV} on port: ${PORT}`.yellow.bold
  );
});

// Handle  unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server and exit process
  server.close(() => process.exit(1));
});
