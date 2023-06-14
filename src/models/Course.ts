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
        const query = `insert into courses values (default, ${this.idchauffeur}, ${this.idclient}, '${this.depart}', '${this.destination}', now(), 2, ((select prix from v_chauffeur where iduser=${this.idchauffeur})*(select st_distance(st_makepoint(${this.depart.lat}, ${this.depart.lng}, 4326)::geography, st_makepoint(${this.destination.lat}, ${this.destination.lng}, 4326)::geography))))`

        let sequelize = Connection.getConnection()

        try {
            sequelize.query(query)
        } catch(e) {
            throw e
        } 
    }
    
}

    export default Course