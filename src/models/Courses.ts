import { Connection } from "../connection/Connection"

export class Courses {
    private _idCourse: number
    public get idCourse(): number {
        return this._idCourse
    }
    public set idCourse(value: number) {
        this._idCourse = value
    }

    private _idChauffeur: number
    public get idChauffeur(): number {
        return this._idChauffeur
    }
    public set idChauffeur(value: number) {
        this._idChauffeur = value
    }

    private _idClient: number
    public get idClient(): number {
        return this._idClient
    }
    public set idClient(value: number) {
        this._idClient = value
    }

    private _depart: string
    public get depart(): string {
        return this._depart
    }
    public set depart(value: string) {
        this._depart = value
    }

    private _destination: string 
    public get destination() {
        return this._destination
    }
    public set destination(value: string) {
        this._destination = value
    }

    private _dateCourse: Date
    public get dateCourse(): Date {
        return this._dateCourse
    }
    public set dateCourse(value: Date) {
        this._dateCourse = value
    }

    private _status: number
    public get status(): number {
        return this._status
    }
    public set status(value: number) {
        this._status = value
    }

    private _prix: number 
    public get prix(): number {
        return this._prix
    }
    public set prix(value: number) {
        this._prix = value
    }


    constructor() {

    }

    public static async getRequestCourses(id: number) {
        let connection = Connection.getConnection()
        let query = `select * FROM courses WHERE idchauffeur = ${id} and datecourse > current_timestamp - INTERVAL '4 hours' and status = 2`
        let [results, metadata] :any = await connection.query(query)

        let listCourses: Courses[] = []
        
        for(let row of results) {
            let course = new Courses()
            course.idCourse = row.idcourse
            course.idChauffeur = row.idchauffeur
            course.idClient = row.idclient
            course.depart = row.depart
            course.destination = row.destination
            course.dateCourse = row.datecourse
            course.status = row.status
            course.prix = row.prix

            listCourses.push(course)
        }

        return listCourses
        
    }
}