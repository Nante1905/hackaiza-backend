import express from "express";
import { Connection } from "../connection/Connection";
import Driver from "../models/Driver";
import { User } from "../models/User";

const user = express.Router();

user.get('/driver/:id',async (req, res) => {
    const id = req.params.id
    const connection = Connection.getConnection();
    try {
        const driver = await Driver.findDriverById(parseInt(id), connection);
        driver.note = await Driver.getNotes(parseInt(id));

        res.json({
            OK: true,
            driver
        })
    } catch (error) {
        console.log(error);
        res.json({
            OK: false
        })
    } finally {
        connection.close();
    }
})

user.get('/client/:id',async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findUserById(parseInt(id));
        res.json({
            OK: true,
            user
        })
    } catch (error) {
        console.log(error);
        res.json({
            OK: false
        })
    }
})

user.get('/driver/comment/:id', async (req, res) => {
    const id = req.params.id
    try {
        const comments = await Driver.GetComment(id);
        const note = await Driver.getNotes(id);
        res.json({
            OK: true,
            comments,
            note
        })
    } catch (error) {
        console.log(error);
        res.json({
            OK: false
        })
    } 
})

export default user