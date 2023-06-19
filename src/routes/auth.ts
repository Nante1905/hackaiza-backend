import express from "express"
import { Connection } from "../connection/Connection"
import { User } from "./../models/User"

const auth = express.Router()
auth.post('/client', async (req, res) => {

    let { email, pass } = req.body
    console.log(req.body)

    let user = await User.findWithUserAndPass(email, pass, 1)
    console.log(user)
    if(user != null) {
        res.json({
            "message" : "connected",
            "id" : user.idUser
        })
    }
    else {
        res.json({
            "message": "error"
        })
    }
})

auth.post('/driver', async (req, res) => {

    let { email, pass } = req.body
    console.log(req.body)

    let user = await User.findWithUserAndPass(email, pass, 2)
    console.log(user)
    if(user != null) {
        res.json({
            "message" : "connected",
            "id" : user.idUser
        })
    }
    else {
        res.json({
            "message": "error"
        })
    }
})

auth.post('/register', async (req, res) => {
    let { token, id } = req.body
    let query = `insert into tokens values (${id}, ${token})`
    let sequelize = Connection.getConnection()
    try {
        await sequelize.query(query)
        res.json({
            "code": 1,
            "message": "token saved"
        })
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

export default auth