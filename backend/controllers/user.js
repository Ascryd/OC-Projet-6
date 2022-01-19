const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")



// Autre système de gestion d'erreurs
const Erreurs = (err) => {
  console.log(err.message, err.code)
  let errors = { email: "", password: ""}

  if (err.message.includes("Error, expected `email` to be unique.")) {
    errors.email = "Cette adresse email est déjà enregistrée"
    console.log("ok")  
    return errors
  }
  
  //validation erreurs
  if (err.message.includes("User validation failed")) {
    (Object.values(err.errors)).forEach(({properties}) => {
      errors[properties.path] = properties.message
    })
  }

  return errors
}



// -------  Logique métier de la fonction signup
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }))
        
        // .catch (err => {
        //   const errors = Erreurs(err)
        //   res.status(400).json({ errors })
        // })

    })
    .catch(err => res.status(500).json({ err }))
}


// ----- Logique métier de la fonction login
exports.login = (req, res, next) => {
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
          .catch(err => res.status(500).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}