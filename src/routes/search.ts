import express from "express"
import { io } from ".."
import CustomWebSocket from "../models/SocketClients"
import Driver from "../models/Driver"
import ServerSocket from "../models/ServerSocket"
import { User } from "../models/User"
import SocketClients from "../models/SocketClients"

const search = express.Router()

search.get('/search', async (req, res) => {
    let longitude = <number>req.body?.longitude
    let latitude = <number>req.body?.latitude

    let driverDispo :any[] = []

    const clients = SocketClients.getDrivers()

    io.to('drivers').emit('dispo')

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
        if(response.length == 0) {
            res.json({"message" : "Aucun chauffeurs trouvé"})
        }
        else {
            res.json(response)
        }
    }, 5000);
})

export default search