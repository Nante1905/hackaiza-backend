import express from "express"
import { User } from "./../models/User"

const signup = express.Router()
signup.post('/client', async (req, res) => {
    let response = await User.SignUpUser(req.body)
    if(response) {
        res.status(200).json({
            "message" : "Inscrit"
        })
    }
    else {
        res.status(500).json({
            "message" : "Error on inscription"
        })
    }
})

signup.post('/driver', async (req, res) => {
    let response = await User.signDriver(req.body)
    if(response) {
        res.status(200).json({
            "message" : "Inscrit"
        })
    }
    else {
        res.status(500).json({
            "message" : "Error on inscription"
        })
    }
})

export default signup

