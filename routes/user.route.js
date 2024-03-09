const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller.js")

router.get("/", UserController.findAll)
router.get("/:id", UserController.findDetail)
router.post("/", UserController.createUser)
router.put("/:id", UserController.updateUser)
router.delete("/:id", UserController.deleteUser)


module.exports = router;