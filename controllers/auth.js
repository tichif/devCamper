const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');

// @route   POST /api/v1/auth/register
// @desc    Register a user
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create a user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create token
  const token = user.getSignJwtToken();

  res.status(201).json({
    success: true,
    token,
  });
});
