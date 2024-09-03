const express = require('express')
const cors = require('cors')

const bodyparser = require('body-parser')
const db = require('./db/db')


const { register, login, findAllUsers, authenticateToken } = require("./api/authController")
const { deleteEvent, updateEvent, registerEvent, getAllEvents, getEventByCreator, getEventById } = require("./api/authEvents")
const { registerReserva, getReserva, getReservaById, getReservaByParticipante, deleteReserva } = require("./api/authReservations")

const app = express()
const port = 3000



app.use(cors())
app.use(express.json())
app.use(bodyparser.json())



app.get("/", (req, res) => {
    return res.json({ "error": "deu certo" })
})


//getall users

//app.get("/users", findAllUsers)
app.post("/user/add", register)
app.post("/user/login", login)


app.get("/events", authenticateToken, getAllEvents)
app.get("/events/:id", authenticateToken, getEventById)
app.get("/eventsc/:criador", authenticateToken, getEventByCreator)
app.post("/events/add", authenticateToken, registerEvent)
app.delete("/events/del/:id", authenticateToken, deleteEvent)
app.put("/events/:id", authenticateToken, updateEvent)

//rotas reserva
app.get("/reservas", authenticateToken, getReserva)
app.get("/reservas/:id", authenticateToken, getReservaById)
app.get("/reservasp/:idparticipante", authenticateToken, getReservaByParticipante)
app.post("/reserva/add", authenticateToken, registerReserva)
app.delete("/reserva/del", authenticateToken, deleteReserva)

const server = app.listen(port, () => {
    console.log("servidor executando")
})
function closeDatabase() {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
async function shutdown() {
    console.log('Shutting down server...');

    try {
        // Fechar o servidor
        server.close((err) => {
            if (err) {
                console.error('Error closing server:', err.message);
            } else {
                console.log('Server closed');
            }
        });

        // Fechar o banco de dados
        await closeDatabase();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error during shutdown:', error.message);
    } finally {
        process.exit(0);
    }
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);