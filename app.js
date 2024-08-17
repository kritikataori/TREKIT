const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const { campgroundSchema } = require('./schemas.js')

mongoose.connect('mongodb://127.0.0.1:27017/trek-it')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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

//home page
app.get('/', (req, res) => {
    res.render('home')
})

//index page
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

//new campground form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

//post a new campground
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//individual show page for each campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground });
}))

//edit form for a campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

//edit the campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true }) //... is spread operator
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete a campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

//will only run if none of the routes are matched. order is very important, it has to be the last call
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("ON PORT 3000 !!!")
})