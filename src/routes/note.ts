import express from "express";
import Driver from "../models/Driver";

const note = express.Router();

note.post('/',async (req, res) => {
    console.log(req.body);
    const { idChat, comment, note } = req.body
    
    try {
        await Driver.insertAppreciation(idChat, comment, note);
        res.json({
            OK: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            OK: false
        })
    }
})

export default note