const User = require('../models/User');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');

// @route   GET /api/v1/users/
// @desc    Get all users
// @access  Private / Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @route   GET /api/v1/users/:id
// @desc    Get single user
// @access  Private / Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @route   POST /api/v1/users/
// @desc    Create a user
// @access  Private / Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @route   PUT /api/v1/users/:id
// @desc    Update a user
// @access  Private / Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @route   DELETE /api/v1/users/:id
// @desc    Delete a user
// @access  Private / Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
