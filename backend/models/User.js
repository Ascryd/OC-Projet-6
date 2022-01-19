const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require("validator")

const userSchema = mongoose.Schema({
    email: { type: String, required: [true, "Veuillez fournir une adresse email"], unique: true, validate: [isEmail, "Veuillez fournir une adresse email valide"]},
    password: { type: String, required: [true, "Veuillez fournir un mot de passe"], minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"]}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)