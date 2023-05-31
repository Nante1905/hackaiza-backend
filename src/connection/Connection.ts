import { Sequelize } from "sequelize"

export class Connection {
    
    public static getConnection = () => {
        // const sequelize = new Sequelize(process.env.DB_URL)
        const sequelize = new Sequelize('taxi', 'taxi', 'taxi', {
            host: 'localhost',
            dialect: 'postgres',
          });

        return sequelize
    }
}