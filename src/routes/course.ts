import express from "express"
import { json } from "sequelize"
import { Courses } from "../models/Courses"

const course = express.Router()


course.post('/listCourses', async (req, res) => {
    try {
        
        let id = Number(req.body.id) as number

        let listCourses = await Courses.getRequestCourses(id)
        console.log(listCourses)
        if(listCourses.length != 0) {
            res.json({
                "list": listCourses
            })
        } 
        else if(listCourses.length == 0) {
            res.json({
                "list": "Aucune course"
            })
        }
    } catch (e) {
        console.log(e)
    }
})

export default course