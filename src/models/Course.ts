import { Connection } from "../connection/Connection"
import Place from "./Place"

class Course {
    idcourse :number
    idchauffeur :number
    idclient :number
    private _depart: string
    private _destination: string
    date :Date
    status :number
    prix :number
    
    public get destination(): Place {
        let latLng = this._destination.split(" ")
        return new Place("", parseFloat(latLng[0]), parseFloat(latLng[1]))
    }
    public set destination(value: string | Place) {
        if(typeof value != 'string') {
            this._destination = value.lat.toString() + " " + value.lng.toString()
        }
    }
    public get depart(): Place {
        let latLng = this._depart.split(" ")
        return new Place("", parseFloat(latLng[0]), parseFloat(latLng[1]))
    }
    public set depart(value: string | Place) {
        if(typeof value != 'string') {
            this._depart = value.lat.toString() + " " + value.lng.toString()
        }
    }

    public save() {
        const query = `insert into courses values (default, ${this.idchauffeur}, ${this.idclient}, st_makepoint(${this.depart.lat}, ${this.depart.lng})::geography, st_makepoint(${this.destination.lat}, ${this.destination.lng})::geography, now(), 2, ((select prix from v_chauffeurs where iduser=${this.idchauffeur})*(select st_distance(st_makepoint(${this.depart.lat}, ${this.depart.lng}, 4326)::geography, st_makepoint(${this.destination.lat}, ${this.destination.lng}, 4326)::geography)/1000)))`

        let sequelize = Connection.getConnection()

        try {
            sequelize.query(query)
        } catch(e) {
            throw e
        } 
    }

    public static async findByIdChauffeur(id) {
        const query = `select * from courses where idchauffeurs=${id}`
        let sequelize = Connection.getConnection()
        let courses :Course[] = []

        try {
            let [results, ] :any = await sequelize.query(query)
            for(let result of results) {
                let temp = new Course()
                temp.idcourse = result.idcourse
                temp.idchauffeur = result.idchauffeur
                temp.idclient = result.idclient
                temp.depart = result.depart
                temp.destination = result.destination
                temp.date = result.datecourse
                temp.status = result.status
                temp.prix = result.prix

                courses.push(temp)
            }
        } catch(e) {
            throw e
        }
    }
    
}

    export default Course