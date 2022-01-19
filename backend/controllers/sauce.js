const Sauce = require("../models/Sauce") 
const fs = require("fs")   // --------------> Fs est un outil de gestion de fichier





// --------------> Ajout d'une sauce <-------------- //
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce ({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
      .then(() => res.status(201).json({ message: "Sauce enregistrée !"}))
      .catch(error => res.status(400).json({ error }))
}



// --------------> Modification d'une sauce <-------------- //
exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ? // --------------> On vérifie si il y a un changement de l'image dans le nouveau formulaire, si oui, première possibilité, sinon, deuxième.
  {
      ...JSON.parse(req.body.sauce),  // --------------> On récupère le body du frontend qu'on transforme en objet JS
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // --------------> On récupère l'image du frontend
  } : { ...req.body } // --------------> Si pas d'image, on récupère les données en JSON 



  // --------------> On va d'abord chercher l'ancienne image de la sauce pour la supprimée si besoin.
    Sauce.findOne ({ _id: req.params.id})  
    .then(sauce => {
      const fileName = sauce.imageUrl.split("/images/")[1] // --------------> On recupère le nom du fichier à supprimé
      if (req.file) {
        fs.unlink(`images/${fileName}`, (error) => {
          if (error) {
            console.log("Aucun fichier à supprimer ! " + error)
          } else {
            console.log(fileName + " supprimé")
          }
        })
      }
    })

    .then (sauce => {
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json ({ message: "Sauce modifiée !" }))
      .catch(error => res.status(400).json({ error }))
    })
}



// --------------> Suppression d'une sauce <-------------- //
exports.deleteOne = (req, res, next) => {
    // --------------> On va chercher le fichier pour avoir l'url de l'image et la supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const fileName = sauce.imageUrl.split("/images/")[1] // --------------> On split l'url en 2 partie, on recup la 2e partie (le nom du fichier) pour le supprimer
            fs.unlink(`images/${fileName}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch(error => res.status(404).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
    
}



// --------------> Récupération d'une sauce grâce à son ID pour l'afficher' <-------------- //
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }))
}



// --------------> Récupération de toutes les sauce pour les afficher <-------------- //
exports.getAllSauces =  (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }))
}



// --------------> Ajout de la fonction Like/Dislike <-------------- //
exports.like = (req, res, next) => {
  
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {   

    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
      console.log("Condition validée !")
      Sauce.updateOne({ _id : req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId }
      })
      .then(() => res.status(201).json({ message: "Like ajouté !" }))
      .catch(error => res.status(400).json({ error }))
    }


    if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
      console.log("Condition validée !")
      Sauce.updateOne({ _id : req.params.id },
      {
        $inc: { likes: -1 },
        $pull: { usersLiked: req.body.userId }
      })
      .then(() => res.status(201).json({ message: "Like retiré !" }))
      .catch(error => res.status(400).json({ error }))
    }

    if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
      console.log("Condition validée !")
      Sauce.updateOne({ _id : req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId }
      })
      .then(() => res.status(201).json({ message: "Dislike ajouté !" }))
      .catch(error => res.status(400).json({ error }))
    }

    if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
      console.log("Condition validée !")
      Sauce.updateOne({ _id : req.params.id },
      {
        $inc: { dislikes: -1 },
        $pull: { usersDisliked: req.body.userId }
      })
      .then(() => res.status(201).json({ message: "Dislike ajouté !" }))
      .catch(error => res.status(400).json({ error }))
    }

  })
    .catch(error => res.status(404).json({ error }))
}
