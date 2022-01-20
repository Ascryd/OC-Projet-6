const rateLimit = require("express-rate-limit")

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limite chaque IP à 10 requêtes par window (ici 15 minutes)
	standardHeaders: true, 
	legacyHeaders: false
})

module.exports = apiLimiter