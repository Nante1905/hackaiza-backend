import { Sequelize } from "sequelize"
import { User } from "./User"

class Driver extends User {
    id :number
    registration :string
    estimatePrice :string
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

    public setAttributeIfNear = (start: any, destination: any, min: number, connection: Sequelize) => {
        let query = `select *, (st_distance(st_setsrid(st_makepoint(${ this.lng }, ${ this.lat }), 4326), st_setsrid(st_makepoint(10, 10), 4326))) as distance from driver where idDriver=${this.id}`
    }
}

export default Driver