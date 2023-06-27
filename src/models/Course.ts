import { Sequelize } from "sequelize"
import { Connection } from "../connection/Connection"
import Place from "./Place"

// -1 creer 1 accepter 0 refuser

class Course {
    idcourse :number
    idchauffeur :number
    nomchauffeur :string
    nomclient :string
    idclient :number
    private _depart: Place
    private _destination: Place
    date :Date
    status :number
    private _prix: number

    public get prix(): number {
        return this._prix
    }
    public set prix(value: number | string) {
        if(typeof value == 'string') {
            this._prix = parseFloat(value)
        }
        else 
            this._prix = value
    }
    
    public get destination(): Place {
        return this._destination
    }
    public set destination(value: Place) {
        this._destination = value
    }
    public get depart(): Place {
        return this._depart
    }
    public set depart(value: Place) {
        this._depart = value
    }

    public save() {
        const query = `insert into courses values (default, ${this.idchauffeur}, ${this.idclient}, st_makepoint(${this.depart.lat}, ${this.depart.lng})::geography, st_makepoint(${this.destination.lat}, ${this.destination.lng})::geography, now() at time zone 'gmt-3', -1, ((select prix from v_chauffeurs where iduser=${this.idchauffeur})*(select st_distance(st_makepoint(${this.depart.lat}, ${this.depart.lng}, 4326)::geography, st_makepoint(${this.destination.lat}, ${this.destination.lng}, 4326)::geography)/1000)), ${this.depart.lat}, ${this.depart.lng}, ${this.destination.lat}, ${this.destination.lng}, '${this.depart.name}', '${this.destination.name}')`

        let sequelize = Connection.getConnection()

        try {
            sequelize.query(query)
        } catch(e) {
            throw e
        } 
    }

    public static async findByIdChauffeur(id) { // courses pending pour le chauffeur => id
        const query = `select c.*, ch.nom nomchauffeur, u.nom nomclient from courses c join v_chauffeurs ch on c.idchauffeur=ch.iduser join users u on c.idclient=u.iduser where idchauffeur=${id} and status=-1 and (extract(epoch from now() - c.datecourse)/3600) < 4`
        let sequelize = Connection.getConnection()
        let courses :Course[] = []

        let [results, ] :any = await sequelize.query(query)
        for(let result of results) {
            let temp = new Course()
            temp.idcourse = result.idcourse
            temp.idchauffeur = result.idchauffeur
            temp.idclient = result.idclient
            temp.depart = temp.destination = new Place(result.nomdepart, result.departlng, result.departlat)
            temp.destination = new Place(result.nomdestination, result.destinationlng, result.destinationlat)
            temp.date = result.datecourse
            temp.status = result.status
            temp.prix = result.prix
            temp.nomchauffeur = result.nomchauffeur
            temp.nomclient = result.nomclient
            courses.push(temp)
        }
        return courses
    }

    public static async findByIdClient(id) { // courses pending pour le chauffeur => id
        const query = `select c.*, ch.nom nomchauffeur, u.nom nomclient from courses c join v_chauffeurs ch on c.idchauffeur=ch.iduser join users u on c.idclient=u.iduser where idclient=${id} and status>-1 and (extract(epoch from now() - c.datecourse)/3600) < 4`
        let sequelize = Connection.getConnection()
        let courses :Course[] = []

        let [results, ] :any = await sequelize.query(query)
        for(let result of results) {
            let temp = new Course()
            temp.idcourse = result.idcourse
            temp.idchauffeur = result.idchauffeur
            temp.idclient = result.idclient
            temp.depart = temp.destination = new Place(result.nomdepart, result.departlng, result.departlat)
            temp.destination = new Place(result.nomdestination, result.destinationlng, result.destinationlat)
            temp.date = result.datecourse
            temp.status = result.status
            temp.prix = result.prix
            temp.nomchauffeur = result.nomchauffeur
            temp.nomclient = result.nomclient
            courses.push(temp)
        }
        return courses
    }

    public static async accept(idCourse, connection :Sequelize, transaction) {
        let query = `update courses set status=1 where idcourse=${idCourse}`
        let getCourseQuery = `select idchauffeur, idclient from courses where idcourse=${idCourse}`
        // const connection = Connection.getConnection()
        try {
            await connection.query(query, {
                transaction: transaction
            })
            let [result] = await connection.query(getCourseQuery) 
            return result[0]
        } catch(e) {
            throw e
        } finally {
            // connection.close()
        }
    }
    public static refuse(idCourse) {
        let query = `update courses set status=0 where idcourse=${idCourse}`
        let connection = Connection.getConnection()
        try {
            connection.query(query)

        } catch(e) {
            throw e
        } finally {
            connection.close()
        }
    }
    
}

export default Course