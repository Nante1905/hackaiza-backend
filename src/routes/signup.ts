import express from "express"
import { User } from "./../models/User"

const signup = express.Router()
signup.post('/client', async (req, res) => {
    try {
        let response = await User.SignUpUser(req.body)
        console.log(response)
        res.status(200).json({
            "code" : 1,
            "message" : "Inscrit"
        })
        // if(response === true) {
        // }
        // else if(response == null) {
        //     res.status(500).json({
        //         'code' : 2,
        //         "message" : "Code d'activation invalide"
        //     })
        // }
    }
    catch(e) {
        console.log(e)
        if(e instanceof Error) {
            res.status(500).json({
                'code' : 0,
                "message" : e.message
            })
        }
        else {
            res.status(500).json({
                message: 'Erreur interne du serveur'
            })
        }
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
        if(e instanceof Error) {
            res.status(500).json({
                "code" : 0,
                "message" : e.message
            })
        }
        else {
            res.status(500).json({
                message: "Erreur interne du serveur"
            })
        }
        console.log(e)
    }
})

export default signup

