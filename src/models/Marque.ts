import { Connection } from "../connection/Connection"

class Marque {

    private _id: number
    private _nom: string
    

    public static async findAll() {
        let connection = Connection.getConnection()
        let query = "select * from marque"
        let marques :Marque[] = []

        try {
            let [results, ] :any = await connection.query(query)
            
            for(let result of results) {
                let temp = new Marque()
                temp.id = result.idmarque
                temp.nom = result.nom

                marques.push(temp)
            }

            return marques

        } catch(e) {
            throw e
        } finally {
            connection.close()
        }
    }

    public get id(): number {
        return this._id
    }
    public set id(value: number) {
        this._id = value
    }
    public get nom(): string {
        return this._nom
    }
    public set nom(value: string) {
        this._nom = value
    }
}

export default Marque