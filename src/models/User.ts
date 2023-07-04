import { Connection } from "../connection/Connection"

export class User {
    idUser :number
    nom :string
    prenom :string
    naissance: Date
    phone :string
    email :string
    idRole :number
    password: string
    

    constructor() {
        
    }


    public static findWithUserAndPass = async (email, pass, role) => {
        let connection = Connection.getConnection()
        let query = `select * from utilisateurs where (email='${email}' or phone='${email}') and pass=md5('${pass}') and idrole=${role}`
        let user :User = null

        try {
            let [results, metadata] :any = await connection.query(query)
            //console.log(results[0]);

            if(results.length != 0) {
                user = new User()
                user.idUser = results[0].idutilisateur
                user.nom = results[0].nom
                user.prenom = results[0].prenom
                user.email = results[0].email
            }
        } catch(e) {
            //console.log(e)
        }


        return user
    }

    public static findUserById = async (id :number) => {
        let connection = Connection.getConnection()
        let query = `select * from utilisateurs where idutilisateur=${id}`

        let user :User = null
        
        try {
            let [results, metadata] :any = await connection.query(query)
            if(results) {
                user = new User()
                user.idUser = results[0].idutilisateur
                user.idRole = results[0].idrole
                user.nom = results[0].nom
                user.prenom = results[0].prenom
                user.naissance = results[0].datenaissance
                user.phone = results[0].phone
                user.email = results[0].email
                //console.log("ssssssssss ", results[0])
            }
        } catch(e) {
            //console.log(e)
            throw e;
        }
        connection.close();
        return user
    }

    public static SignUpUser = async (body) => {
        //console.log(body)
        let { nom, prenom, naissance, email, phone, password, activation } = body

        let connection = Connection.getConnection();

        // Jerena oe existant ve ilay code d'activation
        let activationQuery = `select * from activation where code='${activation}' and status='1'` // status = 1 midika oe avaliable le code
        let [activationResult,] = await connection.query(activationQuery)
        if(activationResult.length < 1) {
            throw new Error("Code d'activation invalide")
        }

        let naissanceDate :Date = new Date(naissance)
        if(new Date().getFullYear() - naissanceDate.getFullYear() < 18) {
            throw new Error('Date de naissance invalide')
        }

        // Raha disponible le code
        let query = `insert into utilisateurs values (default, '${nom}', '${prenom}', '${naissance}', '${email}', '${phone}', md5('${password}'), 1)`;

        // let [results,] :any
        try { 
            let [results,] = await connection.query(query);
            return true
        } 
        catch (e) {
            //console.log("Exception sur signup user " + e);
            throw e;
        }
    }

    public static signDriver = async (body) => {
        //console.log(body)

        let { nom, prenom, naissance, email, phone, password, idMarque, model, plaque, prix, activation } = body

        let connection = Connection.getConnection();

    //     // Jerena oe existant ve ilay code d'activation
        let activationQuery = `select * from activation where code='${activation}' and status='1'` // status = 1 midika oe avaliable le code
        let [activationResult, ] = await connection.query(activationQuery)
        if(activationResult.length < 1) {
            throw new Error('Code activation invalide')
        }

        let naissanceDate :Date = new Date(naissance)
        if(new Date().getFullYear() - naissanceDate.getFullYear() < 18) {
            throw new Error('Date de naissance invalide')
        }

        const plaquePattern = /^\d{4}[A-Za-z]{3}$/

        if(!plaquePattern.test(plaque)) {
            throw new Error('Plaque invalide')
        }

        if(prix < 0) {
            throw new Error('Le prix ne peut pas être négatif')
        }

        // Inserena ao am user sy chauffeur izy transactionnel
        const t = await connection.transaction()
        let queryuser = `insert into utilisateurs values (default, '${nom}', '${prenom}', '${naissance}', '${email}', '${phone}', md5('${password}'), 2) returning idutilisateur`;

        let driverQuery = `insert into chauffeurs values (default, :idUsers, ${idMarque}, '${model}', '${plaque}', ${prix})`

        try {
            let [results, ] :any = await connection.query(queryuser, { transaction: t })

            //console.log('result => ', results)

            await connection.query(driverQuery, {
                transaction: t,
                replacements: {
                    idUsers: results[0].idutilisateur
                }
            })
            t.commit()
        } catch(e) {
            t.rollback()
            throw e
        }
        
    }

    public static async getNotificationToken(id) :Promise<string> {
        let query = `select * from utilisateurs where idutilisateur=${id}`
        let sequelize = Connection.getConnection()
        try {
            let [result, ] :any = await sequelize.query(query)
            return result[0].token
        } catch(e) {
            console.log(e)
        }
    }
}