const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground')

const Joi = require('joi')
const { campgroundSchema } = require('../schemas')

//middleware function to be passed in the routes for server side validation. we don't use app.use() here because we do not want to apply this to every route
const validateCampground = (req, res, next) => {
    //campgroundSchema from schemas.js
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')

        //join() concatenates all elements of an array into a single string, using a separator to that string that is passed as the argument.

        //we iterate over error.details using the map() method. Each item of that array has message, and map() retrieves the message string from each element. the resulting array is chained to a join() method, that will return a single string. 

        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//index page
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

//new campground form
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

//post a new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//individual show page for each campground
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}))

//edit form for a campground
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

//edit the campground
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true }) //... is spread operator
    req.flash('success', 'Successfully updated campground ')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete a campground
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))

module.exports = router;