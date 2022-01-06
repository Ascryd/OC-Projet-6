const http = require("http")
const express = require("express")
const app = require("./app")

const server = http.createServer(app)

app.listen(3000, () => console.log("server started 3000"))