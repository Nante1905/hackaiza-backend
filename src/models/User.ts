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

    public static SignUpDriver = async (name, forname, birthdate, telephone, email, password, registration, idBrand, estimationPrice) =>
    {
        let connection = Connection.getConnection();
        let queryuser = `insert into users(name, forname, birthdate, telephone, email, idrole, password) values ('${name}', '${forname}', '${birthdate}', '${telephone}', '${email}', 2, md5('${password}'))`;

        let [results, metadata] :any = null;
        try
        { 
            [results, metadata] = await connection.query(queryuser);
        } 
        catch (e)
        {
            console.log("Exception sur signup user " + e);
            throw e;
        }
        console.log("metadata user " + metadata);

        if ([results, metadata].length != 0) 
        {
            let querylastuser = "select * from users order by id desc limit 1"
            let [results_lastuser, metadata_lastuser] :any = null;
            let id = 0;
            
            try
            { 
                [results_lastuser, metadata_lastuser] = await connection.query(querylastuser);
            } 
            catch (e)
            {
                console.log("Exception sur get last user " + e);
                throw e;
            }
            console.log("Last inserted user " + results_lastuser);
            
            
            if(results_lastuser.length != 0) {
                id =results_lastuser[0].idusers

                let querydriver = `insert into driver values (${id}, '${registration}', ${idBrand}, 1, ${estimationPrice}')`; 
                let [results_driver, metadata_driver] :any = null;
                try
                { 
                    [results_driver, metadata_driver] = await connection.query(querydriver);
                } 
                catch (e)
                {
                    console.log("Exception sur signup user " + e);
                    throw e;
                }
                console.log("metadata driver " + metadata_driver);
            }
        }
    }
}