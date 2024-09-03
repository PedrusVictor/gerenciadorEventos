const db = require('../db/db')
const { body, validationResult } = require('express-validator')

//função que retorna todos os eventos
function getAllEvents(req, res) {


    const smt = db.prepare("SELECT * FROM eventos")
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
            // Caso não encontre o evento, retornar 404

            return res.status(404).json({ error: "Erro ao consultar o banco de dados" });
        }
    })


}

//retorna o evento pelo id
function getEventById(req, res) {
    const { id } = req.params


    const smt = db.prepare("SELECT * FROM eventos WHERE id = (?)")
    smt.get(id, (err, row) => {
        smt.finalize()
        if (err) {
            console.error(err.message)

            return res.status(500).json({ error: "erro ao consultar o banco de dados" })
        }
        if (row) {

            return res.json(row)
        }
        else {
            // Caso não encontre o evento, retornar 404

            return res.status(404).json({ error: "Evento não encontrado" });
        }
    })


}

//retorna o evento criados pelo usuário
function getEventByCreator(req, res) {
    const { criador } = req.params

    //pega o id do criador para usar na consulta
    const smt = db.prepare("SELECT * FROM eventos WHERE criador = (?)")
    smt.all(criador, (err, row) => {
        smt.finalize()
        if (err) {
            console.error(err.message)

            return res.status(500).json({ error: "erro ao consultar o banco de dados" })
        }

        //se tiver eventos criados pelo usuário, vai retornar uma lista que será usada para criar uma string para query no sqlite
        if (row) {


            const idsEvs = row.map(r => r.id)
            const joinIds = idsEvs.map(() => "?").join(",")

            const partSel = db.prepare(`SELECT * FROM reserva WHERE idEvent in (${joinIds})`)
            partSel.all(...idsEvs, (e, rows) => {
                partSel.finalize()
                if (e) {
                    console.error(e.message)

                    return res.status(500).json({ error: "erro ao consultar o banco de dados" })
                }
                if (rows) {
                    const eventCriados = row.map(r => ({ ...r, participantes: rows.filter(rese => rese.idEvent === r.id) }))

                    return res.json(eventCriados)

                }
                else {
                    // Caso não encontre o evento, retornar 404

                    return res.status(404).json({ error: "Reserva não encontrada" });
                }
            })



        }
        else {
            // Caso não encontre o evento, retornar 404

            return res.status(404).json({ error: "Evento não encontrado" });
        }
    })



}

//registro de eventos

const registerEvent = ([
    body('name').isLength({ min: 5 }), body('date').notEmpty(), body('hora').notEmpty(), body('local').isLength({ min: 5 }), body('capacidade').isNumeric(), body('describe').isLength({ min: 5 }), body('criador').notEmpty(), (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }

        ///validação de dados

        //primeiro verifica se o usuário é válido/existe, se sim, registra o evento com o id do criador
        const { name, date, hora, local, capacidade, describe, criador } = req.body


        const getU = db.prepare("SELECT * FROM users WHERE id = ?")
        getU.get(criador, (e, row) => {
            if (e) {

                console.error(e.message)
                getU.finalize()
                return res.status(500).json({ error: "criador inválido" })
            }

            if (row && row.type == "adm") {

                const smt = db.prepare("INSERT INTO eventos (name,date,hora,local,capacidade,inscritos,describe,criador) values(?,?,?,?,?,?,?,?)", [name, date, hora, local, capacidade, 0, describe, criador])
                getU.finalize()
                smt.run((err) => {
                    if (err) {
                        console.error(err.message)

                        smt.finalize()
                        return res.status(500).json({ error: "erro ao adicionar um novo evento" })
                    }
                    smt.finalize()

                    return res.status(201).json({ id: this.lastId, message: "novo evento adicionado" })

                })
            }
            else {
                getU.finalize()
                return res.status(500).json({ error: "criador inválido" })

            }

        })

    }])
//deletar evento. essa ação é somente para o adm/criador do evento
//quando deleta um evento, as reservas/inscrições para participar desse evento são apagadas
function deleteEvent(req, res) {
    const { id } = req.params


    const smt = db.prepare('DELETE FROM eventos WHERE id =?')
    smt.run(id, (err) => {
        smt.finalize()
        if (err) {
            console.error(err.message)

            return res.status(500).json({ error: "erro ao deletar evento" })
        }



        const delResEv = db.prepare('DELETE FROM reserva WHERE idEvent = ?')
        delResEv.run(id, (e) => {
            delResEv.finalize()
            if (e) {
                console.error(e.message)


                return res.status(500).json({ error: "erro ao apagar reservas relacionadas ao evento" })
            }


            return res.status(200).json({ error: "evento deletado" })
        })

    })

}

//função de atualizar informaçoes de evento.. não atualiza data de criação,somente data em que vai ocorrer
const updateEvent = ([
    body('name').isLength({ min: 5, max: 10 }),
    body('date').notEmpty(), body('hora').notEmpty(),
    body('local').isLength({ min: 5, max: 20 }),
    body('capacidade').isNumeric(),
    body('describe').isLength({ min: 5, max: 20 }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }


        const { id } = req.params
        const { name, date, hora, local, capacidade, describe } = req.body


        const smt = db.prepare("UPDATE eventos SET name=?,date=?,hora=?,local=?,capacidade=?,describe = ?  WHERE id = ?")
        smt.run([name, date, hora, local, capacidade, describe, id], (err) => {
            smt.finalize()
            if (err) {
                console.error(err.message)

                return res.status(500).json({ error: "não foi possível alterar os dados do evento" })
            }


            return res.status(200).json({ error: "infomações do evento foram alteradas" })

        })

    }
])
module.exports = { deleteEvent, updateEvent, registerEvent, getAllEvents, getEventByCreator, getEventById }