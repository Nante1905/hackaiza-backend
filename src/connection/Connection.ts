import { Sequelize } from "sequelize"

export class Connection {
    public static getConnection = () => {
        const sequelize = new Sequelize(process.env.DB_URL)

        return sequelize
    }
}