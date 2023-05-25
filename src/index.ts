import { Server,Socket } from "socket.io"
import http from "http"
import express from "express"
import auth from "./routes/auth"
import authentification from "./routes/authentification"
require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.get("/", (req, res) => {
    res.json({"message": "Hello world"})
})
app.use('/auth', auth)

app.use('/authentification', authentification)

io.on('connection', (socket: Socket) => {
    console.log('Nouvelle connexion :', socket.id);
  
    // Joindre tous les clients dans une room
    socket.join('user_connected');
  
    // Lister tous les clients dans la room
    socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName);
        console.log(`Client ${socket.id} a rejoint la room ${roomName}`);
    
        const clients = io.sockets.adapter.rooms.get(roomName);
        console.log('Clients connectés dans la room:', clients);
      });

  });

server.listen(3000, () => console.log("app listening"))