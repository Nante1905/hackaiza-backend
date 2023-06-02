import express from "express"
import { Role } from "../models/Role"
import { UserAfa } from "../models/UserAfa"

const authentification = express.Router()
authentification.get('/', async (req, res) => {

    let user = await UserAfa.checkUser('steph@gmail.com', 'azerty')
    if(user != null) {
        res.json({
            "user" : JSON.stringify(user)                
        })            
    } else {
        res.json({
            "message": "Une erreur c'est produite, vérifier votre mail ou mot de passe"
        })
    }
})


export default authentification