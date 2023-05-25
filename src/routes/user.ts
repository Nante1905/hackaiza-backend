import express from "express"
import { User } from "./../models/User"

const user = express.Router()

user.get('/signupclient/:name/:forname/:birthdate/:telephone/:email/:password', async (req, res) =>
{
    const name = req.params.name;
    const forname = req.params.forname;
    const birthdate = req.params.birthdate;
    const telephone = req.params.telephone;
    const email = req.params.email;
    const password = req.params.password;

    try
    {
        await User.SignUpUser(name, forname, birthdate, telephone, email, password)
        res.json({
            "message" : "Inscription OK"
        })
    }
    catch(e)
    {
        console.log('Exception server sur signupclient')
        res.json({
            "message" : "Inscription failed"
        })
        res.redirect('/inscription')
    }
})

user.get('/signupdriver/:name/:forname/:birthdate/:telephone/:email/:password/:registration/:idbrand/:estimationPrice', async (req, res) =>
{
    const name = req.params.name;
    const forname = req.params.forname;
    const birthdate = req.params.birthdate;
    const telephone = req.params.telephone;
    const email = req.params.email;
    const password = req.params.password;
    const registration = req.params.registration;
    const idbrand = req.params.idbrand;
    const estimationPrice = req.params.estimationPrice;

    try
    {
        await User.SignUpUser(name, forname, birthdate, telephone, email, password)
        await User.SignUpDriver(name, forname, birthdate, telephone, email, password, registration, idbrand, estimationPrice)
        res.json({
            "message" : "Inscription OK"
        })
    }
    catch(e)
    {
        console.log('Exception server sur signupdriver')
        res.json({
            "message" : "Inscription failed"
        })
        res.redirect('/inscription')
    }
})
export default user