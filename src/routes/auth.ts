import express from "express"
import { User } from "./../models/User"

const auth = express.Router()
auth.post('/', async (req, res) => {

    let { email, pass } = req.body

    let user = await User.findWithUserAndPass(email, pass)
    console.log(user)
    if(user != null) {
        res.json({
            "message" : "connected"
        })
    }
    else {
        res.json({
            "message": "error"
        })
    }
})

export default auth