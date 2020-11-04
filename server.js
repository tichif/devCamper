const express = require('express');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running in ${process.env.NODE_ENV} on port: ${PORT}`);
});
