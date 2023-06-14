import express from "express"
import { Connection } from "../connection/Connection"
import Course from "../models/Course"
import Driver from "../models/Driver"
import Place from "../models/Place"
import SocketClients from "../models/SocketClients"
import { User } from "../models/User"

export const demande = express.Router()

demande.post('/:id', async (req, res) => {
    console.log("demande de course", req.body)

    const sequelize = Connection.getConnection()

    let { idclient, depart, destination } = req.body
    let idChauffeur = parseInt(req.params.id)

    
    try {
        let chauffeur = await Driver.findDriverById(idChauffeur, sequelize)
        let client = await User.findUserById(idclient)
    
        let course = new Course()
        course.idclient = idclient
        course.idchauffeur = idChauffeur
        course.depart = new Place("", parseFloat(depart.lat), parseFloat(depart.lng))
        course.destination = new Place("", parseFloat(destination.lat), parseFloat(destination.lng))
        course.save()
        for(let driver of SocketClients.getDrivers()) {
            if(driver.data.id == req.params.id) {
                driver.emit("course", "Misy couse ato zandry eh")
                // console.log(driver)
                console.log("demande envoye")
                res.json({
                    message: "lasa any le demande"
                })
            }
        }
    } catch(e) {
        res.status(500).send()
    }


})