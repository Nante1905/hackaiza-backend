import { Connection } from "../connection/Connection"
import Driver from "./Driver"

export class User {
    public username :string
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
            user.username = results[0].username
            user.password = results[0].password
        }


        return user
    }
}