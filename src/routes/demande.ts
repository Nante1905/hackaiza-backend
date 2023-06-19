import express from "express"
import { Connection } from "../connection/Connection"
import Course from "../models/Course"
import Driver from "../models/Driver"
import Place from "../models/Place"
import SocketClients from "../models/SocketClients"
import { User } from "../models/User"
import admin from 'firebase-admin'

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
        course.depart = new Place(depart.name, parseFloat(depart.lng), parseFloat(depart.lat))
        course.destination = new Place(destination.name, parseFloat(destination.lng), parseFloat(destination.lat))

        console.log(depart)
        console.log(course)
        course.save()
        for(let driver of SocketClients.getDrivers()) {
            if(driver.data.id == idChauffeur) {
                driver.emit("course", "Misy couse ato zandry eh")
                let messaging = admin.messaging()
                let tokens = await User.getNotificationToken(idChauffeur)
                for(let userToken of tokens) {
                    await messaging.send({
                        token: userToken,
                        notification: {
                            title: "Vous avez un client",
                            body: `De ${depart.name} à ${destination.name}`
                        }
                    })
                }
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
        let courses = await Course.findByIdChauffeur(req.params.id)
        console.log("course an i " + req.params.id, courses)

        res.json(courses)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})