import { NUMBER } from "sequelize"
import { Connection } from "../connection/Connection"
import { io } from 'socket.io-client';
import { Server,Socket } from "socket.io"
import { Role } from "./Role"


export class UserAfa { 

    constructor(public idUser :number, public name :string, public forName :string, public birthday :Date, public telephone :string, public email :string, public idRole :number, public password :string){

    }

    public static checkUser = async (name, email) => {
        let connection = Connection.getConnection()
        // console.log(connection)
        let query = "SELECT * FROM users WHERE name = '" + name + "' AND email = '" + email + "'"

        let [results, metadata] :any = await connection.query(query)
        console.log(results)

        let user :UserAfa = null
        if(results.length != 0) {
            user = new UserAfa(results[0].iduser, results[0].name, results[0].forname,results[0].birthday, results[0].telephone, results[0].email,results[0].idrole, results[0].password)
            const socket = io('http://localhost:3000');
            socket.on('connect', () => {
                console.log('Connecté au serveur Socket.IO');

                // Joindre le client à une room
                const roomName = 'user_connected';
                socket.emit('joinRoom', roomName);
            });
        }

        return new Promise((resolve, reject) => {
            if(user != null) {
                resolve(user)
            }
        })
    }

}