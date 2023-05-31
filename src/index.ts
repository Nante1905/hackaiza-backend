import { Server,Socket } from "socket.io"
import http from "http"
import express from "express"
import auth from "./routes/auth"
import user from "./routes/user"
import authentification from "./routes/authentification"

require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.get("/", (req, res) => {
    res.json({"message": "Hello world"})
})
app.use('/auth', auth)

app.use('/user', user);
app.use('/authentification', authentification)

io.on('connection', (socket: Socket) => {

  });

server.listen(3000, () => console.log("app listening"))