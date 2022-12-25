const express = require("express")
const router = express.Router()
const ThoughtsController = require("../controllers/ThoughtsController.js")

const checkAuth = require("../helpers/auth.js")

router.get("/dashboard", checkAuth, ThoughtsController.dashboard)
router.get("/create", checkAuth, ThoughtsController.formCreateThought)
router.get("/edit/:id", checkAuth, ThoughtsController.editThoughtForm)

router.post("/create", ThoughtsController.saveThought)
router.post("/delete", ThoughtsController.deleteThought)
router.post("/edit/:id", ThoughtsController.editThought)


module.exports = router