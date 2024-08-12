const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Campground = require('./models/campground')


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

//home page
app.get('/', (req, res) => {
    res.render('home')
})

//index page
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

//new campground form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

//post a new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

//individual show page for each campground
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    try {
        const campground = await Campground.findById(id)
        if (!campground) {
            return res.status(404).send('Campground not found');
        }
        res.render('campgrounds/show', { campground });
    } catch (e) {
        console.error(e);
        res.status(500).send('Server Error');
    }
})

//edit form for a campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

//edit the campground
app.put('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true }) //... is spread operator
    res.redirect(`/campgrounds/${campground._id}`)
})

//delete a campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(3000, () => {
    console.log("ON PORT 3000 !!!")
})