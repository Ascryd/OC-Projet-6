const express = require("express")
const app = express()
require ("./app")

app.listen(3000, () => console.log("server started 3000"))