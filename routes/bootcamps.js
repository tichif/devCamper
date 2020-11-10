const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');
const Bootcamp = require('../models/Bootcamp');

// Include other resources routers
const coursesRouter = require('./courses');

const router = express.Router();

// Re-route into others resource routers
router.use('/:bootcampId/courses', coursesRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
