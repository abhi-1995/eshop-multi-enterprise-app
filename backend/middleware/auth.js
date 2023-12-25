const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncError = require("./catchAsyncError")
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const error = require("./error");


exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;


    if (!token) {
        return next(error(new ErrorHandler("Please login to continue",401),req,res,next));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
})
