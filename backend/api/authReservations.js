const db = require('../db/db')
const { body, validationResult } = require('express-validator')

//retorna todas as reservas
function getReserva(req, res) {

    const smt = db.prepare("SELECT * FROM reserva")
    smt.all((err, row) => {
        smt.finalize()
        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "erro ao consultar o banco de dados" })
        }
        if (row) {
            
            return res.json(row)
        }
        else {
            // Caso não encontre a reserva, retornar 404
            
            return res.status(404).json({ error: "Reservas não encontradas" });
        }
    })

}

//retorna reserva por id
function getReservaById(req, res) {
    const { id } = req.params


    const smt = db.prepare("SELECT * FROM reserva WHERE id = ?")
    smt.all(id, (err, row) => {
        smt.finalize()

        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "id da reserva não encontrado ao consultar o banco de dados" })
        }
        if (row) {
           
            return res.json(row)
        }
        else {
            // Caso não encontre reserva, retornar 404
            
            return res.status(404).json({ error: "Reserva não encontrada" });
        }
    })

}

//retorna reserva do usuário. retorna eventos em que ele está participando
function getReservaByParticipante(req, res) {

    const { idparticipante } = req.params


    const getResP = db.prepare("SELECT idEvent FROM reserva WHERE idParticipante = ?")
    getResP.all(idparticipante, (err, row) => {
        getResP.finalize()
        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "erro ao consultar reservas do usuário no banco de dados" })
        }
        if (row) {
            const idsEv = Array.from(new Set(row.map(e => e.idEvent)))

            const placeholders = idsEv.map(() => '?').join(',');
            const getEventos = db.prepare(`SELECT * FROM eventos WHERE id IN (${placeholders})`)

            getEventos.all(...idsEv, (erro, rows) => {
                getEventos.finalize()
                if (erro) {
                    console.error(erro.message)
                   
                    
                    return res.status(500).json({ error: "erro na solicitação:", erro })
                }
                if (rows) {

                    return res.json(rows)
                }
                else {
                    
                    
                    return res.status(404).json({ error: "dados da reserva não encontrada" });
                }
            })


        }
        else {
            // Caso não encontre o reserva, retornar 404
            
            return res.status(404).json({ error: "Reserva não encontrada" });
        }
    })

}


const registerReserva = ([body('idEvent').isNumeric(),body('idParticipante').isNumeric(),(req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const { idEvent, idParticipante } = req.body



    const ins = db.prepare('UPDATE eventos SET inscritos = inscritos +1 where id = ? AND capacidade > inscritos')
    ins.run(idEvent, (err) => {

        ins.finalize()
        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "não há espaço para reservas" })
        }
        const smt = db.prepare('INSERT INTO reserva (idEvent,idParticipante) values(?,?)')
        smt.run([idEvent, idParticipante], (erro) => {
            smt.finalize()
            if (erro) {
                console.error(erro.message)
                
                
                return res.status(500).json({ error: "erro ao adicionar reserva" })
            }
           
           
            return res.status(201).json({ id: this.lastId, message: "reserva realizada com sucesso!" })
        })



    })







}])


function deleteReserva(req, res) {
    const { idEvent, idUser } = req.body


    const gReserva = db.prepare("SELECT * FROM reserva WHERE idEvent = ? AND idParticipante = ?")
    gReserva.get([idEvent, idUser], (err, row) => {
        gReserva.finalize()
        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "erro na solicitação" })
        }
        if (row) {



            const altEv = db.prepare("UPDATE eventos SET inscritos = inscritos -1 WHERE id = ? AND inscritos >0")
            altEv.run(idEvent, (e) => {
                altEv.finalize()
                if (e) {
                    console.error(e.message)
                    
                    
                    return res.status(500).json({ error: "erro na remoção da inscrição no evento" })
                }


                const smt = db.prepare("DELETE FROM reserva WHERE idEvent = ? AND idParticipante = ?")
                smt.run([idEvent, idUser], (erro) => {
                    smt.finalize()
                    if (erro) {
                        console.error(erro.message)
                        
                        return res.status(500).json({ error: "erro na solicitação de exclusão da reserva" })
                    }
                    
                   
                    
                    return res.status(200).json({ error: "reserva apagada" })
                })


            })


        }
    })




}

module.exports = { registerReserva, getReserva, getReservaById, getReservaByParticipante, deleteReserva }