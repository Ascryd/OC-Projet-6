const mongoose = require("mongoose")



const sauceSchema = mongoose.Schema({
    userId: { type: String, require: true },
    name: { type: String, require: [true, "Veuillez fournir un nom"] },
    manufacturer: { type: String, require: [true, "Veuillez fournir un fabriquant"] },
    description: { type: String, require: [true, "Veuillez fournir une description"] },
    mainPepper: { type: String, require: [true, "Veuillez fournir l'ingrédient principal"] },
    imageUrl: { type: String, require: [true, "Veuillez fournir une image"] },
    heat: { type: Number, require: [true, "Veuillez fournir un indice de chaleur"] },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
})

module.exports = mongoose.model("Sauce", sauceSchema)