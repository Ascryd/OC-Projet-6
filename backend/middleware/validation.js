// --------------> ValidatorJs nous sers pour vérifier les données avant la BDD

const Validator = require("validatorjs")

const validator = (body, rules, customMessages, callback) => { // --------------> On configure le validator 
    const validation = new Validator (body, rules, customMessages)
    validation.passes(() => callback(null ,true))
    validation.fails(() => callback(validation.errors, false))
}

const signup = (req, res, next) => { // --------------> On crée des règles/ attribut pour sécuriser la route signup (notemment pour le mdp)
    const validationRule = {
        "email": "required|email",
        "password": "required|min: 6" // --------------> Minimum 6 caractères
    }
    validator(req.body, validationRule, { required : "veuillez entrer un :attribute", min : "le mot de passe doit faire au moins 6 caractères !"}, (error, status) => {
        if (!status) {
            res.status(412).send ({success: false, message: "La validation a échouée", data: error})
        } else {
            next()
        }
    })
}

module.exports = {signup}

