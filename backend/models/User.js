const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator'); 
const { isEmail } = require("validator") // --------------> Validator sers de sécurité supplémentaire

const userSchema = mongoose.Schema({
    email: { type: String, required: [true, "Veuillez fournir une adresse email"], unique: [true, "Cette adresse mail est déjà enregistré"], validate: [isEmail, "Veuillez fournir une adresse email valide"]},
    password: { type: String, required: [true, "Veuillez fournir un mot de passe"]}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)