import { Connection } from "../connection/Connection"

export class Role {

    constructor(public idRole :number, public title :string){

    }

    public static selectRole = async (idRole) => {
        let connection = Connection.getConnection()
        let query = "SELECT * FROM roles WHERE idRole = " + idRole

        let [results, metadata] :any = await connection.query(query)
        console.log(results)

        let role :Role = null
        if(results.length != 0) {
            role = new Role(results[0].idRole, results[0].title)
        }

        return new Promise((resolve, reject) => {
            if(role != null) {
                resolve(role)
            } else{
                reject
            }
        })

    }
}