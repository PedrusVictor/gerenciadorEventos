import { Box, TextField, Button } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from "react-router-dom";

import { useState, useContext,useEffect } from "react";


import { userContext } from "../../App";


//página de registro de usuário

function Signin() {

    const { user, setUser, loadUser } = useContext(userContext)

    const [login, setLogin] = useState(true)

    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [tipo, setTipo] = useState("user")

    const navigate = useNavigate()


    //função de registro
    async function addUser() {


        if (!name || !username || !password || !tipo) {
            return
        }

        try {
            const response = await fetch("http://localhost:3000/user/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({ name: name, login: username, password: password, type: tipo })
            })
            if (!response.ok) {
                throw new Error(`error no fetch:${response.status}`)
            }
            console.log("usuário registrado")
            navigate("/")

        }
        catch (erro) {
            console.error("erro ao cadastrar usuário")
        }

    }

    //função de logar, passa o body e salva o token gerado no localstorage

    async function Logar() {
        if (!username || !password) {
            return
        }
        try {
            const response = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: username, password: password })
            })
            if (!response.ok) {
                throw new Error(`error no fetch:${response.status}`)
            }
            const { token } = await response.json()


            localStorage.setItem("token", token)
            loadUser(token)
            navigate("/")



        }
        catch (error) {
            console.error("erro ao logar", error)

        }
    }

//useEffect para resetar o form usuário depois que logar
    useEffect(()=>{
        const loginAction=()=>{
            setUser("")
            setUsername("")
            setPassword("")
            setTipo("user")
        }
        loginAction()
        
    }
        
        ,[login])
    return (

        <Box sx={{ display: "flex", flexDirection: "column", width: 400, padding: "1em", maxWidth: "90%", height: "min-content", border: "1px solid gray", margin: "1em" }}>


            {!login && <TextField label="nome" variant="standard" value={name} onChange={e => setName(e.target.value)} />}
            <TextField label="login" variant="standard" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField label="password" variant="standard" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {!login &&
                <FormControl >

                    <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        sx={{ justifyContent: "space-around" }}



                    >
                        <FormControlLabel value="user" control={<Radio />} label="Participante" />
                        <FormControlLabel value="adm" control={<Radio />} label="Organizador" />
                    </RadioGroup>
                </FormControl>}

            {login ?
                <Button onClick={Logar} disabled={(()=>{return username.length<4||password.length<4})()}>Login</Button>
                : <Button onClick={addUser} disabled={(()=>{return name.length<4||username.length<4||password.length<4})()}>Registrar</Button>}

            <FormControl >

                <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={login}
                    onChange={(e) => setLogin(e.target.value === "true")}
                    sx={{ justifyContent: "space-around" }}



                >
                    <FormControlLabel value="true" control={<Radio />} label="login" />
                    <FormControlLabel value="false" control={<Radio />} label="register" />
                </RadioGroup>
            </FormControl>


        </Box>
    )
} export default Signin;