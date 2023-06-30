import express from 'express'
import Driver from '../models/Driver'
import Stat from '../models/Stat'

const stat = express.Router()

stat.post('/:id', async (req, res) => {

    const idchauffeur = req.params.id
    const { mois, annee } = req.body


    try {
        const accepte = await Driver.currentStatsCoursesMois(idchauffeur,1, mois, annee)
        const refuse = await Driver.currentStatsCoursesMois(idchauffeur, 0, mois, annee)
        const valide = await Driver.currentStatsCoursesMois(idchauffeur, 3, mois, annee)

        const nbrAccepte = await Driver.currentNbrCoursesMois(idchauffeur,1, mois, annee)
        const nbrRefuse = await Driver.currentNbrCoursesMois(idchauffeur,0, mois, annee)
        const nbrValide = await Driver.currentNbrCoursesMois(idchauffeur,3, mois, annee)
        const nbrManque =  await Driver.currentNbrCoursesMois(idchauffeur,-1, mois, annee)
        const currentIncome = await Driver.getMonthIncome(idchauffeur, mois, annee )
        const prevIncome = await Driver.getMonthIncome(idchauffeur, Stat.getPrevMonth(mois), annee )
        const percentageIncome = Stat.getVariation(prevIncome, currentIncome)
        const total = nbrAccepte + nbrRefuse + nbrValide + nbrManque

        const nbrPreviousAccepte = await Driver.currentNbrCoursesMois(idchauffeur,1, Stat.getPrevMonth(mois), annee)
        const nbrPreviousRefuse = await Driver.currentNbrCoursesMois(idchauffeur,0, Stat.getPrevMonth(mois), annee)
        const nbrPreviousValide = await Driver.currentNbrCoursesMois(idchauffeur,3, Stat.getPrevMonth(mois), annee)
        const nbrPreviousManque =  await Driver.currentNbrCoursesMois(idchauffeur,-1, Stat.getPrevMonth(mois), annee)
        const percentageTotal = Stat.getVariation(nbrPreviousAccepte+nbrPreviousRefuse+nbrPreviousValide+nbrPreviousManque, total)

        let revenu = 0
        for(let v of valide) {
            revenu += v.prix
        }

        res.json({
            OK: true,
            data : {
                accepte,
                refuse,
                valide,
                nbrAccepte,
                nbrRefuse,
                nbrValide,
                nbrManque,
                total,
                revenu,
                percentageIncome,
                percentageTotal
            }
        })

    } catch(e) {
        console.log(e);
        
        res.json({
            OK: false
        })
    }


})

export default stat