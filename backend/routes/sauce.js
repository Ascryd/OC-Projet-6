const express = require("express")
const router = express.Router()
const multer = require("../middleware/multer-config")
const sauceCtrl = require ("../controllers/sauce")
const auth = require("../middleware/auth")


router.post("/", auth, multer, sauceCtrl.addSauce)
router.put("/:id", auth, multer, sauceCtrl.modifySauce)
router.delete("/:id", auth, sauceCtrl.deleteOne)
router.get("/:id", auth, sauceCtrl.getOneSauce)
router.get("/", auth, sauceCtrl.getAllSauces)
router.post("/:id/like", auth, sauceCtrl.like)

module.exports = router