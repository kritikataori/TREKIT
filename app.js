if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()

const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const Campground = require('./models/campground')
const Review = require('./models/review')
const User = require('./models/user')

const ExpressError = require('./utils/ExpressError')

//import the routers
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const dbUrl= 'mongodb://127.0.0.1:27017/trek-it'
mongoose.connect(dbUrl)
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
app.use(express.static(path.join(__dirname, 'public')))

app.use(mongoSanitize({replaceWith: '_'}))

app.use(helmet())
    const scriptSrcUrls = [
        "https://stackpath.bootstrapcdn.com/",
        // "https://api.tiles.mapbox.com/",
        // "https://api.mapbox.com/",
        "https://kit.fontawesome.com/",
        "https://cdnjs.cloudflare.com/",
        "https://cdn.jsdelivr.net",
        "https://cdn.maptiler.com/", 
    ];
    const styleSrcUrls = [
        "https://kit-free.fontawesome.com/",
        "https://stackpath.bootstrapcdn.com/",
        // "https://api.mapbox.com/",
        // "https://api.tiles.mapbox.com/",
        "https://fonts.googleapis.com/",
        "https://use.fontawesome.com/",
        "https://cdn.jsdelivr.net",
        "https://cdn.maptiler.com/", 
    ];
    const connectSrcUrls = [
        // "https://api.mapbox.com/",
        // "https://a.tiles.mapbox.com/",
        // "https://b.tiles.mapbox.com/",
        // "https://events.mapbox.com/",
        "https://api.maptiler.com/", 
    ];
    const fontSrcUrls = [];
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://api.maptiler.com/", 
                    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
                    "https://images.unsplash.com/",
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
            },
        })
    );

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'session',
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//flash middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user; //current user is made avaialable in all templates to be rendered
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//execute the routers
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

//home page
app.get('/', (req, res) => {
    res.render('home')
})

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