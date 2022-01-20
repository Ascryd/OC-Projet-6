const express = require("express")
const router = express.Router()
const userCtrl = require("../controllers/user")
const apiLimiter = require("../middleware/rate-limit")

// ------- Routes pour les fonctions signup et login
router.post("/signup", userCtrl.signup)
router.post("/login", apiLimiter, userCtrl.login)


module.exports = router