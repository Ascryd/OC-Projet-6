const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User") // --------------> On récupère le model User




// --------------> Logique métier de la fonction signup <-------------- //
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // --------------> On hash le mdp avec Bcrypt (ici 10 fois)
    .then(hash => {
      const user = new User({ // --------------> On push le nouvel objet user dans l'array User de MongoDB
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // --------------> Message si validé
        .catch(error => res.status(400).json({ error })) // --------------> Message si échec
        
    })
    .catch(error => res.status(500).json({ error })) // --------------> Message si échec
}


// --------------> Logique métier de la fonction login <-------------- //
exports.login = (req, res, next) => {
    User.findOne ({ email: req.body.email }) // --------------> On recherche un user dans Mongo grâce à son email
      .then( user => {
        if (!user) {    // --------------> Si on ne trouve pas de user
          return res.status(401).json ({ message: "Utilisateur non trouvé !" })
        }
        bcrypt.compare(req.body.password, user.password) // --------------> On compare les mot de passe pour la validation
          .then(valid => {
            if (!valid) { // --------------> Si non valide
              return res.status(401).json ({ message: "Mot de passe incorrect !" })
            }
            res.status(200).json({ // --------------> On renvoie vers le site avec un token de 24h
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
}