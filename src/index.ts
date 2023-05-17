import { Server } from "socket.io"
import http from "http"
import express from "express"
import auth from "./routes/auth"
require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.get("/", (req, res) => {
    res.json({"message": "Hello world"})
})
app.use('/auth', auth)

io.on("connection", (socket) => {
    console.log("User connected on socket")
})

server.listen(3000, () => console.log("app listening"))