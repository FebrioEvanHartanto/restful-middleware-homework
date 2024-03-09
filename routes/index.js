const express = require('express');

//Group Endpoints
const router = express.Router();
const movieRouter = require("./movie.route.js");
const userRouter = require("./user.route.js");
const authRouter = require("./auth.route.js")
const {authentication} = require ("../middlewares/auth.js")

router.use("/api/auth", authRouter);
router.use(authentication);
router.use("/api/movies", movieRouter);
router.use("/api/users", userRouter);


module.exports = router;