const express = require("express")
const router = express.Router()
const multer = require("../middleware/multer-config")
const sauceCtrl = require ("../controllers/sauce")


router.post("/", multer, sauceCtrl.addSauce)
router.put("/:id", sauceCtrl.modifySauce)
router.delete("/:id", sauceCtrl.deleteOne)
router.get("/:id", sauceCtrl.getOneSauce)
router.get("/", sauceCtrl.getAllSauces)

module.exports = router