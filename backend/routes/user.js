const express = require("express")
const router = express.Router()

const userCtrl = require("../controllers/user")

const apiLimiter = require("../middleware/rate-limit")
const validation = require("../middleware/validation")



// --------------> ------- Routes pour les fonctions signup et login
router.post("/signup", validation.signup , userCtrl.signup) // --------------> Validation.signup sers à valider les données avant la base de données
router.post("/login", apiLimiter, userCtrl.login)


module.exports = router