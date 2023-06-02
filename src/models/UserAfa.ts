import { NUMBER } from "sequelize"
import { Connection } from "../connection/Connection"
import { io } from 'socket.io-client';
import { Server,Socket } from "socket.io"
import { Role } from "./Role"


export class UserAfa { 
    idUser :number
    nom :string
    prenom :string
    dateNaissance :Date
    email :string
    phone :string
    pass :string

    constructor(){

    }

    public static checkUser = async (email, pass) => {
        let connection = Connection.getConnection()
        // console.log(connection)
        let query =`SELECT * FROM users WHERE email = '${email}' AND pass = '${pass}'`

        let [results, metadata] :any = await connection.query(query)
        console.log(results)

        let user :UserAfa = null
        if(results.length != 0) {
            user = new UserAfa()
            
            user.idUser = results[0].idUser
            user.nom = results[0].nom
            user.prenom = results[0].prenom
            user.dateNaissance = results[0].dateNaissance
            user.email = results[0].email
            user.phone = results[0].phone
            user.pass = results[0].pass


            const socket = io('http://localhost:3000');
            socket.on('connect', () => {
                console.log('Connecté au serveur Socket.IO');

                // Joindre le client à une room
                const roomName = 'user_connected';
                socket.emit('joinRoom', roomName);
            });
        }
        else {
            throw new Error("Identifient of user not found");
        }

        return user
    }

}