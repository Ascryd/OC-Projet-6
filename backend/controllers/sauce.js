const Sauce = require("../models/Sauce")
const fs = require("fs")


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


exports.modifySauce = (req, res, next) => {

    Sauce.findOne ({ _id: req.params.id})
    .then(sauce => {   
      const fileName = sauce.imageUrl.split("/images/")[1]
      if (req.file !== fileName) {
        fs.unlink(`images/${fileName}`, (error) => {
          if (error) {
            console.log("Aucun fichier à supprimer ! " + error)
          } else {
            console.log(fileName + " supprimé")
          }
        })
      }
    })
    const sauceObject = req.file ? // --------------> On vérifie si il y a un changement de l'image dans le nouveau formulaire, si oui, première possibilité, sinon, deuxième.
    {
        ...JSON.parse(req.body.sauce),  // ------------------> On récupère le body du frontend qu'on transforme en objet JS
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // ----------------------> On récupère l'image du frontend
    } : { ...req.body } // -------------------- Si pas d'image, on récupère les données en JSON 

    // console.log(fileName)
    
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json ({ message: "Sauce modifiée !" }))
      .catch(error => res.status(400).json({ error }))
}


exports.deleteOne = (req, res, next) => {
    // -----------------> On va chercher le fichier pour avoir l'url de l'image et la supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const fileName = sauce.imageUrl.split("/images/")[1] // --------------------------> On split l'url en 2 partie, on recup la 2e partie (le nom du fichier) pour le supprimer
            fs.unlink(`images/${fileName}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch(error => res.status(404).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
    
}


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }))
}


exports.getAllSauces =  (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }))
}


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








// like envoie +1 et dislike envoie -1


// Si user est déjà dans la liste "j'aime" : arrêter la boucle
// Sinon si la liste "j'aime" existe et que userId n'est pas dans la liste "j'aime pas" : on push
// Sinon si la liste "j'aime" existe mais que userId est dans "j'aime pas" : pop + push
// Sinon si la liste 'j'aime" n'existe pas et que userId est dans "j'aime pas" : create "j'aime" + push + pop
// Sinon si rien n'existe : créer "j'aime" + push



// if (like === 1) {
//   console.log("Liked")
//   if (Sauce.usersLiked[userId]) {
//     // Arrêter la boucle 
//   } else if ( Sauce.usersLiked && (Sauce.usersDisliked[userId] = "undefined")) {
//     Sauce.usersLiked.push(userId)
//   } else if ( Sauce.usersLiked && Sauce.usersDisliked[userId] ) {
//     Sauce.usersDisliked.pop(userId)
//     Sauce.usersLiked.push(userId)
//   } else if ( Sauce.usersDisliked[userId] ) {
//     Sauce.usersLiked = []
//     Sauce.usersLiked.push(userId)
//     Sauce.usersDisliked.pop(userId)
//   } else {
//     Sauce.usersLiked = []
//     Sauce.usersLiked.push(userId)
//   }
//   console.log(Sauce.usersLiked)


// } else if (like === -1) {
//   console.log("Disliked")
//   if (Sauce.usersDisliked[userId]) {
//     // Arrêter la boucle 
//   } else if ( Sauce.usersDisliked && (Sauce.usersLiked[userId] = "undefined")) {
//     Sauce.usersDisliked.push(userId)
//   } else if ( Sauce.usersDisliked && Sauce.usersLiked[userId] ) {
//     Sauce.usersLiked.pop(userId)
//     Sauce.usersDisliked.push(userId)
//   } else if ( Sauce.usersLiked[userId] ) {
//     Sauce.usersDisliked = []
//     Sauce.usersDisliked.push(userId)
//     Sauce.usersLiked.pop(userId)
//   } else {
//     Sauce.usersDisliked = []
//     Sauce.usersDisliked.push(userId)
//   }
//   console.log(Sauce.usersDisliked)
// }