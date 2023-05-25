import express from "express"
import { Role } from "../models/Role"
import { UserAfa } from "../models/UserAfa"

const authentification = express.Router()
authentification.get('/', (req, res) => {

    UserAfa.checkUser('Rabe', 'rabe@gmail.com').then((user :UserAfa) => {
        
        if(user != null) {
            Role.selectRole(user.idRole).then((role :Role) => {
                res.json({
                    "message" : "Connected",
                    "Role" : role.title
                })
                
            })
        } else {
            res.json({
                "message": "error"
            })
        }
    }).catch((error) => {})
})


export default authentification