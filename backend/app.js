const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));



//config

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path:"backend/config/.env"
    });
}

//import routes
const user = require("./controllers/user");

app.use("/api/v1/user", user);

app.use(ErrorHandler);


module.exports = app;