import express from "express"
import { User } from "./../models/User"

const signup = express.Router()
signup.post('/client', async (req, res) => {
    try {
        let response = await User.SignUpUser(req.body)
        console.log(response)
        if(response === true) {
            res.status(200).json({
                "code" : 1,
                "message" : "Inscrit"
            })
        }
        else if(response == null) {
            res.status(500).json({
                'code' : 2,
                "message" : "Code d'activation invalide"
            })
        }
    }
    catch(e) {
        console.log(e)
        res.status(500).json({
            'code' : 3,
            "message" : "Erreur interne du serveur"
        })
    }
})

signup.post('/driver', async (req, res) => {
    try {
        await User.signDriver(req.body)
        
        res.status(200).json({
            "code" : 1,
            "message" : "Inscrit"
        })

    } catch(e) {
        console.log(e)
        res.status(500).json({
            "code" : 0,
            "message" : "Erreur interne du serveur"
        })
    }
})

export default signup

