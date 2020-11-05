// @route   GET /api/v1/bootcamps
// @desc    Get all bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Get all bootcamps' });
};

// @route   GET /api/v1/bootcamps/:id
// @desc    Get a single bootcamp
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` });
};

// @route   POST /api/v1/bootcamps
// @desc    Create a bootcamp
// @access  Public
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ success: true, msg: 'Create a new bootcamp' });
};

// @route   PUT /api/v1/bootcamps
// @desc    Update a bootcamp
// @access  Public
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @route   DELETE /api/v1/bootcamps
// @desc    Delete a bootcamp
// @access  Public
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
