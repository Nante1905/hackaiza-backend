import express from "express"
import { io } from ".."
import CustomWebSocket from "../models/SocketClients"
import Driver from "../models/Driver"
import ServerSocket from "../models/ServerSocket"
import { User } from "../models/User"
import SocketClients from "../models/SocketClients"
import { Connection } from "../connection/Connection"

const search = express.Router()

search.post('/', async (req, res) => {
    let { start, destination, min } = req.body
    console.log('place ');
    // console.log(start, destination);
    console.log(min);
    console.log(start);
    console.log(destination);
    
    
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
    let checkDistance = false;
    console.log(driverDispo);
    
    setTimeout(async () => {
        let userTemp: Driver;
        for(let driver of driverDispo) {
            // let userTemp = await Driver.findDriverById(driver.id, connection)
            // userTemp.lng = driver.lng
            // userTemp.lat = driver.lat
            // response.push(userTemp)
            userTemp = new Driver();
            userTemp.id = driver.id;
            userTemp.lat = driver.lat
            userTemp.lng = driver.lng
            
            console.log(userTemp)
            checkDistance = await userTemp.setAttributeIfNear(start, destination, min, connection);
            if(checkDistance) {
                console.log(userTemp);
                
                response.push(userTemp);
            }
        }
        if(response.length == 0) {
            res.json([])
        }
        else {
            res.json(response)
        }
    }, 10000);
})

export default search