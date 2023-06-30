import express from "express";
import { Socket } from "socket.io";
import Chat from "../models/Chat";
import SocketClients from "../models/SocketClients";

const chat = express.Router()

chat.get('/:id', async (req, res) => {
    const iduser = req.params.id
    try {
        const chats = await Chat.findByIdUser(parseInt(iduser))
        console.log(chats)

        res.json({
            OK: true,
            chats
        })
    } catch(e) {
        console.log(e)
        res.json({
            OK: false
        })
    }
})

chat.get('/info/:id', async (req, res) => {
    const idchat = req.params.id
    
    try {
        const chat = await Chat.find(idchat)

        res.json({
            OK: true,
            chat
        })
    } catch(e) {
        console.log(e)
        res.json({
            OK: false
        })
    }
})

chat.get('/messages/:id', async (req, res) => {
    const idchat = req.params.id
    try {
        const messages = await Chat.findAllMessage(idchat)

        res.json({
            OK: true,
            messages
        })
    } catch(e) {
        res.json({
            OK: false
        })
    }
})

chat.post('/send/', async (req, res) => {
    const { idchat, idexpedit, text } = req.body
    try {
        let chat = await Chat.find(idchat)
        if(chat.status == 1) {
            let result = await Chat.sendMessage(idchat, idexpedit, text)
            let sendId
            let driver = false
            if(idexpedit == result.idchauffeur) {
                sendId = result.idclient
            } 
            else if(idexpedit == result.idclient) {
                sendId = result.idchauffeur
                driver = true
            }
            if(sendId) {
                let socket :Socket
                if(driver) {
                    socket = SocketClients.findDriver(sendId)
                }
                else if(driver == false) {
                    socket = SocketClients.findClient(sendId)
                }
    
                if(socket) {
                    socket.emit('message', {
                        idexpedit,
                        idchat,
                        text
                    })
                }
                console.log(socket.data)
                console.log(socket.id)
            }
            res.json({
                OK: true
            })
        } else {
            res.json({
                OK: false,
                error: "Chat ferme"
            })
        }
    } catch(e) {
        res.json({
            OK: false,
            message: e
        })
        console.log(e)
    }
})

chat.get('/close/:id', async (req, res) => {
    const idchat = req.params.id
    try {
        await Chat.close(idchat)

        res.json({
            OK: true
        })
    } catch(e) {
        console.log(e)
        res.json({
            OK: false
        })
    }
})

export default chat