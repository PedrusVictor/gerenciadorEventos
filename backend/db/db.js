const sqlite = require('sqlite3').verbose()

const db =new sqlite.Database("database.db")
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,login TEXT,password TEXT,type TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS eventos(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,date TEXT,hora TEXT,local TEXT, capacidade INTEGER,inscritos INTEGER,describe TEXT,criador INTEGER)")
    db.run("CREATE TABLE IF NOT EXISTS reserva (id INTEGER PRIMARY KEY AUTOINCREMENT, idEvent INTEGER, idParticipante INTEGER)")
})

module.exports = db