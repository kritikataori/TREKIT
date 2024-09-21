const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')

const Campground = require('../models/campground')

const Joi = require('joi')


//index page
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

//new campground form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

//post a new campground
router.post('/', validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//show page for each campground
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({ //nested populate 
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author')
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}))

//edit form for a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

//edit the campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true }) //... is spread operator
    req.flash('success', 'Successfully updated campground ')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))

module.exports = router;