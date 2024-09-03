import { Box, TextField, Button } from "@mui/material";



import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { userContext } from "../../App";
import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
function FormEvent() {

    const [titleEvent, setTitleEvent] = useState("")
    const [local, setLocal] = useState("")
    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)
    const [capacidade, setCapacidade] = useState("")
    const [describe, setDescribe] = useState("")

    const [error,setError]=useState(null)

    //const user = { "id": 1, "name": "teste", "login": "teste123", "password": "teste", "type": "adm" }
    const {user} = useContext(userContext)

    const navigate = useNavigate()

    //função de adicionar evento
    async function addEvent() {

        if (!titleEvent|| !date||  !time|| !local||  !capacidade||  !describe|| !user.id) {
            setError("campos não preenchidos")
            alert("campos digitados inválidos")
            return
        }
        const ev = { name:titleEvent, date: date.format("YYYY-MM-DD"), hora: time.format("HH:mm"), local: local, capacidade: capacidade, describe: describe, criador: user.id }
        
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:3000/events/add", {
                method: "POST",
                headers: {"Content-Type":"application/json","Authorization":`Bearer ${token}`},
                body: JSON.stringify(ev)
            })
            if (!response.ok) {
                setError("erro: dados inválidos")
                throw new Error(`error no fetch:${response.status}`)
            }
            console.log("evento adicionado")
            setError(null)
            navigate("/")
        }
        catch (error) {
            console.error("erro ao cadastrar evento")
        }
    }
    //formulário para criar eventos

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: 400, padding: 2, borderRadius: 12 }}>
            {error}
            <TextField label="Título" variant="outlined" value={titleEvent} onChange={e => setTitleEvent(e.target.value)}  />
            <TextField label="Local" variant="outlined" value={local} onChange={e => setLocal(e.target.value)} />
            <Box sx={{ display: "flex" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>


                    <DatePicker label="data" value={date} onChange={setDate} />
                    <TimePicker label="horário" value={time} onChange={setTime} ampm={false} />



                </LocalizationProvider>
            </Box>

            <TextField label="Capacidade" type="number" variant="outlined" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
            <TextField label="Descrição" variant="outlined" multiline value={describe} onChange={e => setDescribe(e.target.value)} />
            <Button color="success" variant="outlined" onClick={addEvent} disabled={(()=>titleEvent.length<4|| !date||  !time|| local.length<4||  !capacidade||  describe.length<4|| !user.id)()}>Adicionar evento</Button>

        </Box>
    )
} export default FormEvent;