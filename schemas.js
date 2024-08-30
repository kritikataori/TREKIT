const Joi = require('joi')

//Joi.object({...}): This creates a Joi schema object, which specifies the structure of the data you expect.

// campground: Joi.object({...}): This indicates that the req.body should contain an object called campground. Inside this object, there are several required fields.

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})