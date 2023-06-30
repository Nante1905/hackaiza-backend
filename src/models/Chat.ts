import { Sequelize } from "sequelize"
import { Connection } from "../connection/Connection"
import chat from "../routes/chat"
import Driver from "./Driver"
import { User } from "./User"

// 1 ouvert, 10 ferme
class Chat {
    private _idchat
    private _status
    private _client: User
    private _chauffeur: Driver
    private _idcourse
    

    public static async create(idClient, idChauffeur, idCourse, connection: Sequelize, transaction) { 
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

    public static async close(idchat) {
        const query = `update chat set status = 10 where idchat=${idchat}`
        const connection = Connection.getConnection()
        try {
            await connection.query(query)
        } catch(e) {
            console.log(e)
        } finally {
            connection.close()
        }
    }

    public static async sendMessage(idchat, idexpedit, text) {
        const query = `insert into messages values(default, ${idchat}, ${idexpedit}, '${text.replaceAll("'", "''")}', now() at time zone 'gmt-3')`

        const conn = Connection.getConnection()
        try {
            await conn.query(query)
            const result = await this.find(idchat)
            return {
                idclient: result.idclient,
                idchauffeur: result.idchauffeur
            }
        } catch(e) {
            throw e
        } finally {
            conn.close()
        }
    }

    public static async findByIdUser(iduser :number) {
        const query = `select * from v_chat_last_message where (idclient=${iduser} or idchauffeur=${iduser}) and status=1 order by dateenvoie`
        const connection = Connection.getConnection()
        try {
            let [results, ] = await connection.query(query)
            return results
        } catch(e) {
            throw e
        } finally {
            connection.close()
        }
    }

    public static async findAllMessage(idchat) {
        const query = `select * from messages where idchat=${idchat} order by dateenvoie`
        const connection = Connection.getConnection()
        try {
            let [results] = await connection.query(query)
            return results
        } catch(e) {
            throw e
        } finally {
            connection.close()
        }
    }

    public static async find(idchat) {
        const query = `select * from v_chat_courses where idchat=${idchat}`
        const connection = Connection.getConnection()
        try {
            const [result] :any = await connection.query(query)
            return result[0]
        } catch(e) {
            console.log(e)
            throw e
        }
        finally {
            connection.close()
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