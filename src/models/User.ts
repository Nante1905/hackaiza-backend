import { Connection } from "../connection/Connection"
import Driver from "./Driver"

export class User {
    idUser :number
    name :string
    birthday :Date
    telephone :string
    email :string
    idRole :number
    public password: string
    constructor() {
        
    }

    public static findWithUserAndPass = async (username, pass) => {
        let connection = Connection.getConnection()
        let query = "select * from users where username='admin' and password='admin'"

        let [results, metadata] :any = await connection.query(query)
        console.log(results);

        let user :User = null
        if(results.length != 0) {
            user = new User()
            user.email = results[0].email
            user.password = results[0].password
        }


        return user
    }

    public static findUserById = async (id :number) => {
        let connection = Connection.getConnection()
        let query = `select * from users where idUser=${id}`

        let [results, metadata] :any = await connection.query(query)
        let user :User = null

        if(results) {
            user = new User()
            user.idUser = results[0].iduser
            user.idRole = results[0].idrole
            console.log(results[0])
        }

        return user
    }
}