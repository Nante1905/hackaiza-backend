import express from "express"
import { io } from ".."
import CustomWebSocket from "../models/CustomWebSocket"
import Driver from "../models/Driver"
import ServerSocket from "../models/ServerSocket"
import { User } from "../models/User"

const search = express.Router()

search.get('/search', async (req, res) => {
    let longitude = <number>req.body?.longitude
    let latitude = <number>req.body?.latitude

    let driverDispo :any[] = []

    // const io = ServerSocket.getInstance()
    const clients = CustomWebSocket.getClients()

    io.to('drivers').emit('dispo', "are you dispo ?", {id: 1, name: "nante"})

    for(let socket of clients) {
        socket.on('disponible', (arg) => {
            driverDispo.push(arg)
            console.log(arg)
        })
    }

    let response :User[] = []

    setTimeout(async () => {
        for(let driver of driverDispo) {
            let userTemp = await Driver.findDriverById(driver.id)
            console.log(userTemp)
            response.push(userTemp)
        }
        res.json(response)
    }, 5000);
})

export default search