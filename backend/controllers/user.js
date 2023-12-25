const express = require("express");
const path = require("path");
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const error = require("../middleware/error");
const { isAuthenticated } = require("../middleware/auth");

const userExistError = new ErrorHandler("User already exist in the system", 400);

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Error deleting file",
          });
        } else {
          res.status(200).json({ message: "file deleted successfully" });
        }
      });
      return next(error(userExistError, req, res, next));
    }

    const fileName = req.file.filename;
    const fileUrl = path.join(fileName);
    const avatar = fileUrl;

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: {
        url: fileUrl,
      },
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
        await sendMail({
            email: user.email,
            subject: "ACTIVATE YOUR ACCOUNT",
            message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`
        })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(200).json({
        success: true,
        message: `Please check your mail ${user.email} to activate your account`
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user

router.post("/activation", catchAsyncError(async (req, res, next) => {
    try {
        const {activation_token} = req.body;
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newUser) {
            return next(error((new ErrorHandler("Invalid Token", 400)),req,res,next));
        }

        const {name, email, password, avatar} = newUser;

        console.log("Token values ................");
        console.log(name);
        console.log(email);
        console.log(password);
        console.log(avatar);

        let user = await User.findOne({email});

        if (user) {
            return next(error(userExistError,req,res,next));
        }

        user = await  User.create({
            name,
            email,
            avatar,
            password
        });



        sendToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler("", 400));
    }
}));

//login user
router.post("/login-user", catchAsyncError(async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(error(new ErrorHandler("Please provide the all fields", 400),req,res,next));
        }

        const user = await User.findOne({email}).select("+password");

        if (!user) {
            return next(error(new ErrorHandler("User doesn't exist in the system", 400),req,res,next));
        }

        const isPasswordValid = await user.comparePassword(password);


        if (!isPasswordValid) {
            return next(error(new ErrorHandler("Email/Password is not valid, please provide correct information", 400),req,res,next));
        }

        sendToken(user, 200, res);



    } catch (err) {
        return next(error(new ErrorHandler(err.message, 500),req,res,next));
    }
}));

//load user

router.get("/getuser", isAuthenticated, catchAsyncError(async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(error(new ErrorHandler("user doesn't exist", 500), req, res, next));
        }

        res.status(200).json({
            success: true,
            user,
        })
    } catch(err) {
        return next(error(new ErrorHandler(err.message, 500), req, res, next));
    }
}))

//log out user
router.get("/logout", isAuthenticated, catchAsyncError((req, res,next)=>{
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Log out successfully!"
    })
  } catch(e) {
    return next(error(new ErrorHandler(e.message, 500), req, res, next));
  }
}))


module.exports = router;
