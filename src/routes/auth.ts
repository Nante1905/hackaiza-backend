import express from "express"
import { User } from "./../models/User"

const auth = express.Router()
auth.get('/', async (req, res) => {
    let user = await User.findWithUserAndPass("admin", "admin")
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