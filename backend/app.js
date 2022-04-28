const express = require("express")
const mongoose = require("mongoose")
const path = require("path")

const userRoutes = require("./routes/user")
const saucesRoutes = require ("./routes/sauce")


mongoose.connect('mongodb+srv://YourName:<password>@piiquante.xnmim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', // --------------> Connexion à MongoDB
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))


const app = express()

app.use(express.json())


app.use((req, res, next) => {  // --------------> On délare les routes possibles ect pour augmenter la sécurité
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
});


app.use("/images", express.static(path.join(__dirname, 'images'))) // --------------> Configuration de multer / Gestion de fichiers
  
// --------------> On importe les routes/api
app.use("/api/auth", userRoutes)

app.use("/api/sauces", saucesRoutes)



module.exports = app