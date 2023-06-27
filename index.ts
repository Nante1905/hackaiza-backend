import { Server } from "socket.io"
import http from "http"
import express, { json, urlencoded } from "express"
import auth from "./src/routes/auth"
import SocketClients from "./src/models/SocketClients"
import search from "./src/routes/search"
import ServerSocket from "./src/models/ServerSocket"
import { User } from "./src/models/User"
import signup from "./src/routes/signup"
import cors from "cors"
import marque from "./src/routes/marque"
import { demande } from "./src/routes/demande"
import admin from 'firebase-admin'
import * as serviceKey from './hackaiza-push-firebase-adminsdk-6t2ws-d4fdd6e171.json'

require("dotenv").config()

const corsOptions :any = {
    allowAccessOrigin: '*'
}

const app = express()
app.use(urlencoded())
app.use(json())
app.use(cors(corsOptions))

const server = http.createServer(app)

export const io = new Server(server)

ServerSocket.getServerInstance(io)

admin.initializeApp({
    credential: admin.credential.cert(serviceKey as admin.ServiceAccount)
})

app.use('/auth', auth)
app.use("/search", search)
app.use('/signup', signup)
app.use('/marques', marque)
app.use('/demande', demande)
app.get('/test', async (req, res) => {
    res.status(200).send()
})



io.on("connection", (socket) => {
    socket.on("whoami", async (id) => {
        console.log('idSocket ' , id)
        if(id) {
            socket.data.id = id
            let user = await User.findUserById(id)
            console.log(user)
            if(user && user.idRole == 2) {
                SocketClients.deleteDriver(socket)
                SocketClients.addDriver(socket)
                socket.join("drivers")
                console.log("driver connected")
            }
            else if(user && user.idRole == 1) {
                SocketClients.deleteClient(socket)
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

server.listen(parseInt(process.env.PORT), process.env.HOST, () => console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`))