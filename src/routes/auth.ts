import express from "express"
import { User } from "./../models/User"

const auth = express.Router()
auth.get('/', (req, res) => {

    User.findWithUserAndPass("admin", "admin").then((user) => {
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
})

export default auth