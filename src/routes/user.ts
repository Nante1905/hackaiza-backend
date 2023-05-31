import express from "express"
import { User } from "./../models/User"

const user = express.Router()

user.get('/signupclient', async (req, res) =>
{
    const name = req.body.name;
    const forname = req.body.forname;
    const birthdate = req.body.birthdate;
    const telephone = req.body.telephone;
    const email = req.body.email;
    const password = req.body.password;

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
    }
})

user.get('/signupdriver', async (req, res) =>
{
    const name = req.body.name;
    const forname = req.body.forname;
    const birthdate = req.body.birthdate;
    const telephone = req.body.telephone;
    const email = req.body.email;
    const password = req.body.password;
    const registration = req.body.registration;
    const idbrand = req.body.idbrand;
    const estimationPrice = req.body.estimationPrice;

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
    }
})
export default user