import { Sequelize } from "sequelize"
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


        console.log(results)

        return driver
    }
    
    public setAttributeIfNear = async (start: Place, destination: Place, min: number, connection: Sequelize) => {
        console.log('localisation ' + this.lng + ' ' + this.lat);
        let query = `select *, (st_distance(st_setsrid(st_makepoint(${ this.lng }, ${ this.lat }), 4326)::geography, st_setsrid(st_makepoint(${ start.lng }, ${ start.lat }), 4326)::geography))/1000 as distStart, (st_distance(st_setsrid(st_makepoint(${ destination.lng }, ${ destination.lat }), 4326)::geography, st_setsrid(st_makepoint(${ start.lng }, ${ start.lat }), 4326)::geography))/1000 as distPath from v_chauffeurs where iduser=${this.id} order by distStart;`


        console.log('execute query');
        
        let [results, metadata] :any = await connection.query(query)
        
        console.log(results)

        if(results.length > 0) {
            console.log('startDist ' + results[0].diststart);
            console.log('path ' + results[0].distpath);
            
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
}

export default Driver