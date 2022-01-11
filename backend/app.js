const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Sauce = require("./models/Sauce")
const User = require("./models/User")
const jwt = require("jsonwebtoken")

const app = express()

app.use(express.json())


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.post("/api/sauces", (req, res, next) => {
  delete req.body._id
  const sauce = new Sauce ({
    ...req.body
  })
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !"}))
    .catch(error => res.status(400).json({ error }))
})

app.put("/api/sauces/:id", (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json ({ message: "Sauce modifiée !" }))
    .catch(error => res.status(400).json({ error }))
})

app.delete("/api/sauces/:id", (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
})

app.get("/api/sauces/:id", (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
})


app.get("/api/sauces", (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
})

//  USER
app.post("/api/auth/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
})

app.post("/api/auth/login", (req, res, next) => {
  User.findOne ({ email: req.body.email })
    .then( user => {
      if (!user) {    // Si on ne trouve pas de user
        return res.status(401).json ({ message: "Utilisateur non trouvé !" })
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json ({ message: "Mot de passe incorrect !" })
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign (
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            )
          })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
})





mongoose.connect('mongodb+srv://Ascryd:Barbouille123@Piiquante.xnmim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.post 



module.exports = app