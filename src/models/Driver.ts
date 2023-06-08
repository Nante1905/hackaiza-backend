import { Sequelize } from "sequelize"
import Place from "./Place"
import { User } from "./User"

class Driver extends User {
    id :number
    registration :string
    estimatePrice :number
    distance: number
    lng: number
    lat: number

    constructor() {
        super()
    }

    public static async findDriverById(id :number, connection: Sequelize) {
        let query = `select * from driver where idDriver=${id}`
        let [results, metadata] :any = await connection.query(query)

        let driver = new Driver()
        driver.id = results[0].iddriver
        driver.registration = results[0].regitration
        driver.estimatePrice = results[0].estimateprice

        console.log(results)

        return driver
    }

    public setAttributeIfNear = async (start: Place, destination: Place, min: number, connection: Sequelize) => {
        let query = `select *, (st_distance(st_setsrid(st_makepoint(${ this.lng }, ${ this.lat }), 4326), st_setsrid(st_makepoint(${ start.lng }, ${ start.lat }), 4326))) as distStart, (st_distance(st_setsrid(st_makepoint(${ destination.lng }, ${ destination.lat }), 4326), st_setsrid(st_makepoint(${ start.lng }, ${ start.lat }), 4326)))/1000 as distPath from driver where idDriver=${this.id}`

        let [results, metadata] :any = await connection.query(query)
        
        console.log(results)

        if(results.length > 0) {
            if(results[0].distStart <= min) {
                this.id = results[0].iddriver
                this.registration = results[0].regitration
                this.estimatePrice = results[0].estimateprice*results[0].distPath
                this.distance = results[0].distStart
            }
            else {
                return
            }
        }
        else {
            return
        }

    }
}

export default Driver