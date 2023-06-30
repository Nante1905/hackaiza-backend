import { Sequelize } from "sequelize"
import { Connection } from "../connection/Connection"
import Place from "./Place"
import { User } from "./User"

class Driver {
    id :number

    private _nom: string
    public get nom(): string {
        return this._nom
    }
    public set nom(value: string) {
        this._nom = value
    }

    private _prenom: string
    public get prenom(): string {
        return this._prenom
    }
    public set prenom(value: string) {
        this._prenom = value
    }

    private _phone: string
    public get phone(): string {
        return this._phone
    }
    public set phone(value: string) {
        this._phone = value
    }

    private _email: string
    public get email(): string {
        return this._email
    }
    public set email(value: string) {
        this._email = value
    }

    private _marque: string
    public get marque(): string {
        return this._marque
    }
    public set marque(value: string) {
        this._marque = value
    }

    private _modele: string
    public get modele(): string {
        return this._modele
    }
    public set modele(value: string) {
        this._modele = value
    }

    private _plaque: string
    public get plaque(): string {
        return this._plaque
    }
    public set plaque(value: string) {
        this._plaque = value
    }

    private _prix: number
    public get prix(): number {
        return this._prix
    }
    public set prix(value: number) {
        this._prix = value
    }

    private _lng: number
    public get lng(): number {
        return this._lng
    }
    public set lng(value: number) {
        this._lng = value
    }

    private _lat: number
    public get lat(): number {
        return this._lat
    }
    public set lat(value: number) {
        this._lat = value
    }

    private _distance: number
    public get distance(): number {
        return this._distance
    }
    public set distance(value: number) {
        this._distance = value
    }


    constructor() {
    }

    public static async findDriverById(id :number, connection: Sequelize) {
        let query = `select * from v_chauffeurs where iduser=${id}`
        let [results, metadata] :any = await connection.query(query)

        let driver = new Driver()
        driver.id = results[0].iduser
        driver.nom = results[0].nom
        driver.prenom = results[0].prenom
        driver.phone = results[0].phone
        driver.email = results[0].email
        driver.marque = results[0].marque
        driver.modele = results[0].model
        driver.plaque = results[0].plaque
        driver.prix = results[0].prix


        //console.log(results)

        return driver
    }
    
    public setAttributeIfNear = async (start: Place, destination: Place, min: number, connection: Sequelize) => {
        //console.log('localisation ' + this.lng + ' ' + this.lat);
        let query = `select *, (st_distance(st_setsrid(st_makepoint(${ this.lng }, ${ this.lat }), 4326)::geography, st_setsrid(st_makepoint(${ start.lng }, ${ start.lat }), 4326)::geography))/1000 as distStart, (st_distance(st_setsrid(st_makepoint(${ destination.lng }, ${ destination.lat }), 4326)::geography, st_setsrid(st_makepoint(${ start.lng }, ${ start.lat }), 4326)::geography))/1000 as distPath from v_chauffeurs where iduser=${this.id} order by distStart;`


        //console.log('execute query');
        
        let [results, metadata] :any = await connection.query(query)
        
        //console.log(results)

        if(results.length > 0) {
            //console.log('startDist ' + results[0].diststart);
            //console.log('path ' + results[0].distpath);
            
            if(results[0].diststart <= min) {
                this.id = results[0].iduser
                this.nom = results[0].nom
                this.prenom = results[0].prenom
                this.phone = results[0].phone
                this.email = results[0].email
                this.marque = results[0].marque
                this.modele = results[0].modele
                this.plaque = results[0].plaque
                this.prix = results[0].prix*results[0].distpath
                this.distance = results[0].diststart

                return true;
            }
        }
        return false;

    }   


    // status  = 1 ==> stat accepte status = 2 ==> stat refuse
    public static async StatsCourses_Tous_les_Mois_dans_une_anne(id_chauffeur, anne, status) {

        const query = `SELECT * from stat_chauffeur_anne(${id_chauffeur}, ${anne}, ${status})`
        let sequelize = Connection.getConnection()

        let [results, ] :any = await sequelize.query(query)
        
        let reponse = []
        let tous_les_mois = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"]

        for (let result of results) {
            reponse.push(
                {
                    mois : tous_les_mois[result.mois-1],
                    nombre : result.nombre,
                    prix : result.prix_total
                }
            )
        }

        for(let re of reponse) {
            console.log(re)
        }

        return reponse
    }

    // retourne les stats d'un chauffeur a une date donne d1 a (d1 + nb_jour)
    // ilay date atao sous forme string azafady fa raha tsy zany tsy mandeha exemple 2023-06-11
    // limiter ho 15 ny nombre de jour fa azo ovaina 
    public static async StatsCourses_jours_intervalle(id_chauffeur, datedebut, nb_jour, status) {
        // nb_jour = nb_jour - 1
        if(nb_jour > 15 || nb_jour < 0) {
            throw new Error("Nombre de jour Invalide")
        }

        const query = `SELECT * from stat_chauffeur_jour(${id_chauffeur},'${datedebut}'::date, ${nb_jour} ,${status})`
        let sequelize = Connection.getConnection()

        let [results, ] :any = await sequelize.query(query)
        
        let reponse = []

        for (let result of results) {
            reponse.push(
                {
                    date : result.date_genere,
                    nombre : result.nombre,
                    prix : result.prix_total
                }
            )
        }

        for(let re of reponse) {
            console.log(re)
        }

        return reponse
    }

    public static async GetComment(idChauffeur) {
        const query = `SELECT * from v_comment_user WHERE idChauffeur = ${idChauffeur}`

        let sequelize = Connection.getConnection()

        let [results, ] :any = await sequelize.query(query)

        let reponse = []

        for (let result of results) {
            reponse.push(
                {
                    nomClient : result.nom,
                    prenomClient : result.prenom,
                    comment : result.text
                }
            )
        }

        for(let re of reponse) {
            console.log(re)
        }

        return reponse

    }

    public static async GetNotes(idChauffeur) {

        const query = `SELECT avg(valeur) as note FROM notes WHERE idChauffeur = ${idChauffeur}`

        let sequelize = Connection.getConnection()

        let [results, ] :any = await sequelize.query(query)

        let reponse = results[0].note

        return reponse

    }

    public static async InsertComment(idChauffeur, idClient, commentaire) {

        const query = `INSERT INTO commentaires VALUES(default, ${idChauffeur}, ${idClient}, '${commentaire}', NOW())`

        let sequelize = Connection.getConnection()

        try {
            sequelize.query(query)
        } catch(e) {
            throw e
        } 
        
    }
    
    public static async InsertNote(idChauffeur, valeur) {

        if(valeur <= 0 || valeur > 5)
        {
            throw new Error("Note invalide!")
        }

        const query = `INSERT INTO notes VALUES(default, ${idChauffeur}, ${valeur})`

        let sequelize = Connection.getConnection()

        try {
            sequelize.query(query)
        } catch(e) {
            throw e
        } 

    }
    
    public static async StatsCourses_mois(id_chauffeur, mois, anne, status) {
        
        const query = `SELECT * from stat_chauffeur_tous_mois(${id_chauffeur},${mois}, ${anne} ,${status})`
        console.log(query)
        let sequelize = Connection.getConnection()
        let reponse = []

        try {
            let [results, ] :any = await sequelize.query(query)

            for (let result of results) {
                reponse.push(
                    {
                        date : result.date_genere,
                        nombre : result.nombre,
                        prix : result.prix_total
                    }
                )
            }

            for(let re of reponse) {
                console.log(re)
            }
        } catch (error) {
            throw error   
        }
        return reponse
    }

    public static async currentStatsCoursesMois(id_chauffeur, status, mois :number, annee :number) {
        let query = ""
        if(mois === undefined || annee === undefined) {
            query = `SELECT * from stat_chauffeur_tous_mois(${id_chauffeur}, date_part('month', now() at time zone 'gmt-3')::integer, date_part('year', now() at time zone 'gmt-3')::integer ,${status})`
        } else {
            query = `SELECT * from stat_chauffeur_tous_mois(${id_chauffeur}, ${mois}, ${annee} ,${status})`
        }
        
        let sequelize = Connection.getConnection()
        let reponse = []

        try {
            let [results, ] :any = await sequelize.query(query)

            for (let result of results) {
                reponse.push(
                    {
                        date : result.date_genere,
                        nombre : result.nombre,
                        prix : parseFloat(result.prix_total)
                    }
                )
            }
      
            return reponse
        } catch (error) {
            throw error   
        } finally {
            sequelize.close()
        }
    }

    public static async currentNbrCoursesMois(id_chauffeur, status, mois, annee) {
        let query = ""
        if(mois === undefined || annee === undefined) {
            query = `SELECT sum(nombre) nombre from stat_chauffeur_tous_mois(${id_chauffeur}, date_part('month', now() at time zone 'gmt-3')::integer, date_part('year', now() at time zone 'gmt-3')::integer ,${status})`
        }
        else {
            query = `SELECT sum(nombre) nombre from stat_chauffeur_tous_mois(${id_chauffeur}, ${mois}, ${annee} ,${status})`
        }
        let sequelize = Connection.getConnection()

        try {
            let [results, ] :any = await sequelize.query(query)

            return parseFloat(results[0].nombre)
        } catch (error) {
            throw error
        } finally {
            sequelize.close()
        }
    }

    public static async getMonthIncome(id_chauffeur, mois, annee) {
        let query = ""
        if(mois === undefined || annee === undefined) {
            query = `SELECT sum(prix_total) prix from stat_chauffeur_tous_mois(${id_chauffeur}, date_part('month', now() at time zone 'gmt-3')::integer, date_part('year', now() at time zone 'gmt-3')::integer ,3)`
        }
        else {
            query = `SELECT sum(prix_total) prix from stat_chauffeur_tous_mois(${id_chauffeur}, ${mois}, ${annee} ,3)`
        }
        let sequelize = Connection.getConnection()

        try {
            let [results, ] :any = await sequelize.query(query)
            console.log('result ', results);
   
            return parseFloat(results[0].prix)
        } catch (error) {
            throw error
        } finally {
            sequelize.close()
        }
    }

    getStat() {
        
    }
}

export default Driver