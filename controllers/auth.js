const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');

// @route   POST /api/v1/auth/register
// @desc    Register a user
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
