import { Connection } from "../connection/Connection"
import { User } from "./User"

class Driver extends User {
    id :number
    registration :string
    estimatePrice :string

    constructor() {
        super()
    }

    public static async findDriverById(id :number) {
        let connection = Connection.getConnection()
        let query = `select * from driver where idDriver=${id}`
        let [results, metadata] :any = await connection.query(query)

        let driver = new Driver()
        driver.id = results[0].iddriver
        driver.registration = results[0].regitration
        driver.estimatePrice = results[0].estimateprice

        console.log(results)

        return driver
    }
}

export default Driver