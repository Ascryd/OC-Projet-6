const express = require("express")
const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://Ascryd:Barbouille123@Piiquante.xnmim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
