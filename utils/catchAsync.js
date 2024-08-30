module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}

// 1. Promise Rejection:

// If an error occurs during the execution of an asynchronous function (which returns a promise), that promise is rejected. The error object that caused the rejection is automatically passed to the .catch method.

// 2. .catch Method:

// The .catch method takes a function as an argument. This function automatically receives the error as its parameter. You don't need to explicitly declare or catch the error in a variable beforehand.

// 3. Passing the Error to next:

// In the code func(req, res, next).catch(next), the next function is passed as the argument to .catch.
// When the promise is rejected, the .catch(next) syntax effectively becomes .catch(err => next(err)).
// This means that the error is passed to the next function, which is the standard way to hand off an error to the next middleware in Express (typically, this would be your error-handling middleware).