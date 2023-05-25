import { Server } from "socket.io"
import http from "http"
import express from "express"
import auth from "./routes/auth"
import CustomWebSocket from "./models/CustomWebSocket"
import search from "./routes/search"
import ServerSocket from "./models/ServerSocket"
require("dotenv").config()

const app = express()
const server = http.createServer(app)

export const io = new Server(server)

ServerSocket.getServerInstance(io)

app.get("/", (req, res) => {
    res.json({"message": "Hello world"})
})
app.use('/auth', auth)
app.use("/", search)

io.on("connection", (socket) => {
    CustomWebSocket.addClient(socket)
    socket.join("drivers")
    console.log("User connected on socket")
    // io.on('disconnect', () => console.log("disconnected"))
})

server.listen(3000, () => console.log("app listening"))