const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/movie.controller.js")

router.get("/", MovieController.findAll)
router.get("/:id", MovieController.findDetail)
router.post("/", MovieController.createMovie)
router.put("/:id", MovieController.updateMovie)
router.delete("/:id", MovieController.deleteMovie)


module.exports = router;