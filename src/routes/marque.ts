import express from "express";
import { Connection } from "../connection/Connection";
import Marque from "../models/Marque";

const marque = express.Router()

marque.get('/', async (req, res) => {
    try {
        let responseData = await Marque.findAll()
        res.json(responseData)
    } catch(e) {
        console.log(e)
        res.status(500).json({
            "code" : 0,
            "message" : "Cannot fetch all marques"
        })
    }
})

export default marque