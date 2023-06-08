import { Connection } from "../connection/Connection"

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


    public static findWithUserAndPass = async (email, pass) => {
        let connection = Connection.getConnection()
        let query = `select * from users where email='${email}' and pass=md5('${pass}')`

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

    public static SignUpUser = async (body) => {
        console.log(body)
        let { nom, prenom, naissance, email, phone, password, activation } = body

        let connection = Connection.getConnection();

        // Jerena oe existant ve ilay code d'activation
        let activationQuery = `select * from activation where code='${activation}' and status='1'` // status = 1 midika oe avaliable le code
        let [activationResult, metaActivation] = await connection.query(activationQuery)
        if(activationResult.length < 1) {
            return null
        }

        // Raha disponible le code
        let query = `insert into users values (default, '${nom}', '${prenom}', '${naissance}', '${email}', '${phone}', md5('${password}'))`;

        // let [results,] :any
        try { 
            let [results,] = await connection.query(query);
            return results
        } 
        catch (e) {
            console.log("Exception sur signup user " + e);
            // throw e;
        }
    }

    public static signDriver = async (body) => {

        let { nom, prenom, naissance, email, phone, password, idMarque, model, plaque, prix, activation } = body

        let connection = Connection.getConnection();

    //     // Jerena oe existant ve ilay code d'activation
        let activationQuery = `select * from activation where code='${activation}' and status='1'` // status = 1 midika oe avaliable le code
        let [activationResult, ] = await connection.query(activationQuery)
        if(activationResult.length < 1) {
            return null
        }

        // Inserena ao am user sy chauffeur izy transactionnel
        const t = await connection.transaction()
        let queryuser = `insert into users values (default, '${nom}', '${prenom}', '${naissance}', '${email}', '${phone}', md5('${password}')) returning idUser`;

        let driverQuery = `insert into chauffeurs values (default, :idUsers, ${idMarque}, '${model}', '${plaque}', ${prix})`

        try {
            let [results, ] :any = await connection.query(queryuser, { transaction: t })

            console.log('result => ', results)

            await connection.query(driverQuery, {
                transaction: t,
                replacements: {
                    idUsers: results[0].iduser
                }
            })
            t.commit()
        } catch(e) {
            t.rollback()
            console.log(e)
        }
        
    }
}