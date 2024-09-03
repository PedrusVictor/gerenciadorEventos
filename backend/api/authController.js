const db = require('../db/db')
const jwt = require("jsonwebtoken")
const secretkey = "dfdf334w"
const {body,validationResult}= require('express-validator')


//gerar token jwt
function generateToken(user) {
    return jwt.sign({ id: user.id, login: user.login, type: user.type }, secretkey, { expiresIn: '1h' });
}


//verificar token
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.status(401).json({error:"não existe um token"})
    }

    jwt.verify(token,secretkey,(err,user)=>{
        if(err){
            return res.status(500).json({error:"token inválido"})
        }
        req.user=user
        next()
    })
}

//listar usuários, mas não é usada no app
function findAllUsers(req, res) {

    const smt = db.prepare("SELECT * FROM users")
    smt.all((err, row) => {
        smt.finalize()
        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "erro ao consultar usuários no banco de dados" })
        }
        if (row) {
            console.log("entrou get")
            
            return res.json(row)
        }
        else {
            
            // Caso não encontre o evento, retornar 404
            return res.status(404).json({ error: "Erro ao consultar banco de dados" });
        }

    })


}
//login
function login(req, res) {
    const { login, password } = req.body


//pega login e password do body, e prepara a query para pesquisar se existe algum usuário com aquele login, se sim, verifica senha, e depois loga
    const smt = db.prepare("SELECT * FROM users WHERE login = ?")
    smt.get(login, (err, row) => {
        smt.finalize()
        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "erro ao acessar o banco de dados" })
        }
        if (row && row.login === login && row.password === password) {

            const token = generateToken(row)

            //gera o token de autenticação depois que o usuário loga
            
            return res.status(200).json({ token: token })

        }
        else {
            // Caso não encontre o evento, retornar 404
            
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
    })

}

//registro de usuários

//primeira parte é validação e depois pega o req e res
const register=([body('login').isLength({min:5, max:10}),body('name').isLength({min:5,max:20}),body('password').isLength({min:5,max:20}),
    (req, res)=>{
    
    //se houver erros na validação, retorna o erro para o frontend se não, registra
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const { name, login, password, type } = req.body

    const smt = db.prepare("INSERT INTO users (name,login,password,type) VALUES (?,?,?,?)", [name, login, password, type])
    smt.run((err) => {
        smt.finalize()
        if (err) {
            console.error(err.message)
            
            return res.status(500).json({ error: "erro ao adicionar usuário" })
        }
        
        
        return res.status(201).json({ id: this.lastId, message: "novo usuário adicionado" })

    })
}] )

   





module.exports = { register, login, findAllUsers,authenticateToken }