const path = require('path');

const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../util/geocoder');

// @route   GET /api/v1/bootcamps
// @desc    Get all bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @route   GET /api/v1/bootcamps/:id
// @desc    Get a single bootcamp
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @route   POST /api/v1/bootcamps
// @desc    Create a bootcamp
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to request body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not a admin, they can only add one Bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp.`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  return res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @route   PUT /api/v1/bootcamps
// @desc    Update a bootcamp
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is the owner of the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID of ${req.user.id} is not authorized to commit this action.`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @route   DELETE /api/v1/bootcamps
// @desc    Delete a bootcamp
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is the owner of the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID of ${req.user.id} is not authorized to commit this action.`,
        401
      )
    );
  }

  // this method will trigger the middleware which delete courses
  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @desc    Get bootcamps within a radius
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat and lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Dive distance by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @route   PUT /api/v1/bootcamps/:id/photo
// @desc    Upload Photo for bootcamp
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is the owner of the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID of ${req.user.id} is not authorized to commit this action.`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Make validation
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check file size
  if (file.size > process.env.FILE_UPLOAD_MAX_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.FILE_UPLOAD_MAX_SIZE}`,
        400
      )
    );
  }

  // Create a custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse('Something wrong, please try again !!!', 500)
      );
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
