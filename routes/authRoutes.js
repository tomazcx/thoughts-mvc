const express = require("express")
const router = express.Router()
const AuthController = require("../controllers/AuthController.js")

router.get("/login", AuthController.login)
router.get("/register", AuthController.register)
router.get("/logout", AuthController.logout)

router.post("/register", AuthController.registerUser)
router.post("/login", AuthController.validateLogin)

module.exports = router