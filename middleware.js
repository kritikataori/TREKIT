const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    console.log('req.user...', req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in!')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

//middleware function to be passed in the campground routes for server side validation. we don't use app.use() here because we do not want to apply this to every route
module.exports.validateCampground = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


