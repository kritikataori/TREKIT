const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const Campground = require('../models/campground');

const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index)) //index page
    .post(validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground)) //post a new campground

//new campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) //show page
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground)) //edit campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) //delete a campground

//edit form for a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;