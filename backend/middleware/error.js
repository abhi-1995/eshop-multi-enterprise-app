const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "INTERNAL SERVER ERROR"


    //Wrong MongoDB ID
    if (err.name === "CastError") {
        const message = `Resources not found with this id.. invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //Worng JWT Error
    if (err.name === "JsonWebTokenError") {
        const message = `Your Url is invalid please try again later`;
        err = new ErrorHandler(message, 400);
    }

    //Jwt Expire
    if (err.name === "TokenExpiredError") {
        const message = `Your Url is expired please try again later`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

