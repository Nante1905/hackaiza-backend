import { Sequelize } from "sequelize"
import { Client } from "socket.io/dist/client"
import { Connection } from "../connection/Connection"
import Driver from "./Driver"
import { User } from "./User"

class Chat {
    private _idchat
    private _status
    private _client: User
    private _chauffeur: Driver
    private _idcourse
    

    public static async create(idClient, idChauffeur, idCourse, connection: Sequelize, transaction) { // 1 ouvert, 10 ferme
        const query = `insert into chat values (default, 1, ${idClient}, ${idChauffeur}, now() at time zone 'gmt-3', ${idCourse}) returning idchat`
        // const connection = Connection.getConnection()
        try {
            let [result] :any = await connection.query(query, {
                transaction: transaction
            })

            return result[0].idchat
        } catch(e) {
            throw e
        } finally {
            // connection.close()
        }
    }


    public get chauffeur(): Driver {
        return this._chauffeur
    }
    public set chauffeur(value: Driver) {
        this._chauffeur = value
    }
    public get status() {
        return this._status
    }
    public set status(value) {
        this._status = value
    }
    public get client(): User {
        return this._client
    }
    public set client(value: User) {
        this._client = value
    }
    public get idchat() {
        return this._idchat
    }
    public set idchat(value) {
        this._idchat = value
    }
    public get idcourse() {
        return this._idcourse
    }
    public set idcourse(value) {
        this._idcourse = value
    }

}

export default Chat