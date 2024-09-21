const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister) //display registration form
    .post(catchAsync(users.registerUser)) //register the user

router.route('/login')
    .get(users.renderLogin) //display login form
    .post(storeReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.loginUser) //log in the user

router.get('/logout', users.logoutUser); //logout

module.exports = router;