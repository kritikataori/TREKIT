const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(), //extension defined ON joi.string()
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [], //nothing is allowed
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value }) //if the returned value does not equal to the original value, then that means something was removed and we call the string.escapeHTML to display the message
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension) //to call the extension on joi

//Joi.object({...}): This creates a Joi schema object, which specifies the structure of the data you expect.

// campground: Joi.object({...}): This indicates that the req.body should contain an object called campground. Inside this object, there are several required fields.

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})