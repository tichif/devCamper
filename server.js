const express = require('express');
const dotenv = require('dotenv');

const bootcampsRoute = require('./routes/bootcamps');

// Load env variables
dotenv.config();

const app = express();

// Routes
app.use('/api/v1/bootcamps', bootcampsRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running in ${process.env.NODE_ENV} on port: ${PORT}`);
});
