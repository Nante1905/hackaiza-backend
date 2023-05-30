import { Server } from "socket.io"
import http from "http"
import express from "express"
import auth from "./routes/auth"
import SocketClients from "./models/SocketClients"
import search from "./routes/search"
import ServerSocket from "./models/ServerSocket"
import { User } from "./models/User"
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
    socket.on("whoami", async (id) => {
        if(id != null) {
            socket.data.id = id
            let user = await User.findUserById(id)
            console.log(user)
            if(user && user.idRole == 2) {
                SocketClients.addDriver(socket)
                socket.join("drivers")
                console.log("driver connected")
            }
            else if(user && user.idRole == 1) {
                SocketClients.addClient(socket)
                socket.join("clients")
                console.log("client connected")
            }
        }
        else {
            console.log("unable to get id")
        }
    })
    console.log("User connected on socket")
})

server.listen(3000, process.env.HOST, () => console.log("app listening"))