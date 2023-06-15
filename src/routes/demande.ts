import express from "express"
import { Connection } from "../connection/Connection"
import Course from "../models/Course"
import Driver from "../models/Driver"
import Place from "../models/Place"
import SocketClients from "../models/SocketClients"
import { User } from "../models/User"

export const demande = express.Router()

demande.post('/ask', async (req, res) => {
    console.log("demande de course", req.body)

    const sequelize = Connection.getConnection()

    let { idClient, depart, destination, idChauffeur } = req.body.course
    // let  = parseInt(req.params.id)
    
    try {
        let chauffeur = await Driver.findDriverById(idChauffeur, sequelize)
        let client = await User.findUserById(idClient)
    
        let course = new Course()
        course.idclient = idClient
        course.idchauffeur = idChauffeur
        course.depart = new Place("", parseFloat(depart.lng), parseFloat(depart.lat))
        course.destination = new Place("", parseFloat(destination.lng), parseFloat(destination.lat))

        // console.log(course.depart)
        course.save()
        for(let driver of SocketClients.getDrivers()) {
            if(driver.data.id == idChauffeur) {
                driver.emit("course", "Misy couse ato zandry eh")
                // console.log(driver)
                console.log("demande envoye")
            }
        }
        res.json({
            message: "lasa any le demande"
        })
    } catch(e) {
        // res.status(500).send()
        console.log(e)
    }
})
demande.get('/find/:id', async (req, res) => {
    try {
        let courses = Course.findByIdChauffeur(req.params.id)

        res.json(courses)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})