import express from "express"
import { io } from ".."
import CustomWebSocket from "../models/SocketClients"
import Driver from "../models/Driver"
import ServerSocket from "../models/ServerSocket"
import { User } from "../models/User"
import SocketClients from "../models/SocketClients"
import { Connection } from "../connection/Connection"

const search = express.Router()

search.get('/', async (req, res) => {
    let { start, destination } = req.body

    let driverDispo :any[] = []

    const clients = SocketClients.getDrivers()

    io.to('drivers').emit('dispo')

    for(let socket of clients) {
        socket.on('disponible', (arg) => {
            driverDispo.push(arg)
            console.log(arg)
        })
    }

    let connection = Connection.getConnection()
    let response :Driver[] = []
    let min = 1;
    setTimeout(async () => {
        let userTemp: Driver;
        for(let driver of driverDispo) {
            // let userTemp = await Driver.findDriverById(driver.id, connection)
            // userTemp.lng = driver.lng
            // userTemp.lat = driver.lat
            // response.push(userTemp)
            userTemp = new Driver();
            userTemp.id = driver.id;
            
            console.log(userTemp)
            if(userTemp.setAttributeIfNear(start, destination, min, connection)) {
                response.push(userTemp);
            }
        }
        if(response.length == 0) {
            res.json({"message" : "Aucun chauffeurs trouvé"})
        }
        else {
            res.json(response)
        }
    }, 3000);
})

export default search