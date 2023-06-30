import express, { request } from "express"
import { Connection } from "../connection/Connection"
import Course from "../models/Course"
import Driver from "../models/Driver"
import Place from "../models/Place"
import SocketClients from "../models/SocketClients"
import { User } from "../models/User"
import admin, { messaging } from 'firebase-admin'
import Chat from "../models/Chat"

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

        //console.log(depart)
        //console.log(course)
        course.save()

        for(let driver of SocketClients.getDrivers()) {
            if(driver.data.id[0] == idChauffeur) {
                driver.emit("course", "Misy couse ato zandry eh")
                let messaging = admin.messaging()
                let token = await User.getNotificationToken(idChauffeur)
                console.log(token)
                // for(let userToken of tokens) {
                    if(token) {
                        messaging.send({
                            token: token,
                            notification: {
                                title: "Vous avez un client",
                                body: `De ${depart.name} à ${destination.name}`
                            }
                        }).then((result) => console.log(result))
                        .catch(err => console.log(err))
                    }
                // }
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
        //console.log("course an i " + req.params.id, courses)

        res.json(courses)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

demande.get('/client/find/:id', async (req, res) => {
    try {
        let courses = await Course.findByIdClient(req.params.id)
        //console.log("course an i " + req.params.id, courses)

        res.json(courses)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

demande.get('/accept/:id', async (req, res) => {
    let id = req.params.id

    const connection = Connection.getConnection()
    const transaction = await connection.transaction()
    try {
        let { idclient, idchauffeur } :any = await Course.accept(id, connection, transaction)
        const chauffeur = await Driver.findDriverById(idchauffeur, connection)
        let idchat = await Chat.create(idclient, idchauffeur, id, connection, transaction)
        let clientSocket = SocketClients.findClient(idclient)
        console.log("driver accept", clientSocket.data.id)
        clientSocket.emit('notif')
        const token = await User.getNotificationToken(idclient)
        if(token != '' && token != undefined) {
            const messaging = admin.messaging()
            messaging.send({
                token: token,
                notification: {
                    title: "Votre chauffeur est prêt",
                    body: `Le chauffeur ${chauffeur.prenom} ${chauffeur.nom} a accepté votre demande. Vous pouvez maintenant discuter`
                }
            }).then((info) => console.log(info))
            .catch(err => console.log(err))
        }
        transaction.commit()
        res.json({
            "code": 1,
            idchat
        })
    }
    catch(e) {
        console.log(e)
        transaction.rollback()
        res.status(500)
    }
    finally {
        connection.close()
    }
})

demande.get('/refuse/:id', async (req, res) => {
    const idchat = req.params.id
    const conn = Connection.getConnection()
    try {
        const chat = await Chat.find(idchat)
        await Chat.close(idchat)
        let { idclient, idchauffeur } = await Course.refuse(chat.idcourse)
        const token = await User.getNotificationToken(idclient)
        const chauffeur = await Driver.findDriverById(idchauffeur, conn)
        let clientSocket = SocketClients.findClient(idclient)
        if(clientSocket) {
            clientSocket.emit('notif')
        }
        if(token !== '' && token !== undefined) {
            const messaging = admin.messaging()
            messaging.send({
                token: token,
                notification: {
                    title: "Demande refusée",
                    body: `Le chauffeur ${chauffeur.prenom} ${chauffeur.nom} a accepté votre demande. Vous pouvez maintenant discuter`
                }
            })
        }

        res.json({
            code: 1,
            OK: true,
            message: "Demande refusée"
        })
    } catch(e) {
        res.json({
            code: 0,
            OK: false,
            message: "Une erreur s'est produite"
        })
        console.log(e);
    } finally {
        conn.close()
    }
})

demande.get('/validate/:id', async (req, res) => {
    const idcourse = req.params.id
    try {
        await Course.validate(idcourse)

        res.json({
            OK: true
        })
    } catch(e) {
        console.log(e)
        res.json({
            OK: false
        })
    }
})