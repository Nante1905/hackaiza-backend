import { Connection } from "../connection/Connection"

export class User {
    constructor(private username :string, private password: string) {
        
    }

    public static findWithUserAndPass = async (username, pass) => {
        let connection = Connection.getConnection()
        let query = "select * from users where username='admin' and password='admin'"

        let [results, metadata] :any = await connection.query(query)
        console.log(results);

        let user :User = null
        if(results.length != 0) {
            user = new User(results[0].username, results[0].password)
        }


        return new Promise((resolve, reject) => {
            if(user != null) {
                resolve(user)
            }
        })
    }

    public static SignUpUser = async (name, forname, birthdate, telephone, email, password) =>
    {
        let connection = Connection.getConnection();
        let query = `insert into users(name, forname, birthdate, telephone, email, idrole, password) values ('${name}', '${forname}', '${birthdate}', '${telephone}', '${email}', 1, md5('${password}'))`;

        let [results, metadata] :any = null;
        try
        { 
            [results, metadata] = await connection.query(query);
        } 
        catch (e)
        {
            console.log("Exception sur signup user " + e);
            throw e;
        }
        console.log(results);

    }



}