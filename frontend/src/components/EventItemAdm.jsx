import { Card, Button, TextField, CardContent, CardActions, Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useState, useContext , useEffect} from "react";


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { parse } from 'date-fns';
import dayjs from "dayjs";
import { userContext } from "../App";

function EventItemAdm({ events, seteventList }) {

    // const [user, setUser] = useState({"id":3,"name":"sds","login":"dsd","password":"121","type":"user"})
    const { user } = useContext(userContext)
    const [editMode, setEditMode] = useState(false)
    const [local, setLocal] = useState("")
    const [date, setDate] = useState(null)
    const [hora, setHora] = useState(null)
    const [capacidade, setCapacidade] = useState(0)
    const [describe, setDescribe] = useState("")
    const [name, setName] = useState("")




    const [showPart, setShowPart] = useState(false)

    const loadInfo = () => {
        setName(events.name)
        setDate(events.date)
        setLocal(events.local)


        //setHora(dayjs(events.hora))

       setHora(dayjs(parse(events.hora, "HH:mm",new Date())))
        setCapacidade(events.capacidade)
        setDescribe(events.describe)



    }
    useEffect(()=>{
        loadInfo()
    },[])

    function submit() {

        if (name != events.name || local != events.local || hora != events.hora || date != events.date || capacidade != events.capacidade || describe != events.describe) {
            return false
        }

        return true
    }
    async function deleteEvent() {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(`http://localhost:3000/events/del/${events.id}`, {
                headers: {'Authorization':`Bearer ${token}`},
                method: "DELETE"

            })
            if (!response.ok) {
                throw new Error(`erro no fetch : ${response.status}`)
            }
            console.log("evento removido com sucesso!")
            seteventList(prev => prev.filter(e => e.id !== events.id))


        }
        catch (error) {
            console.error("erro ao remover evento")
        }
    }

    async function updateEvent() {
        
        try {
            
           
            const editEvent = {
                name: name, date: typeof(date)==="string"?date:date.format("YYYY-MM-DD"), hora: (typeof (hora) === "string" ? hora : (String(hora.hour()).padStart(2,'0')+":"+String(hora.minute()).padStart(2,'0'))), local: local, capacidade: capacidade, describe: describe
            }

            console.log(editEvent)
            
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/events/${events.id}`, {
                method: "PUT",
                headers: { 'Content-Type': "application/json",'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editEvent)
            })
            
            if (!response.ok) {
                throw new Error(`erro no fetch : ${response.status}`)
            }
            console.log("os dados do evento foram alterados")
            seteventList(prev => prev.map((e) => e.id === events.id ? { id: events.id, name: name, date: editEvent.date, hora: editEvent.hora, local: local, capacidade: capacidade, describe: describe, criador: events.criador } : e))

            setEditMode(false)
        }
        catch (err) {
            console.error("erro ao atualizar evento")
        }

    }


    async function ReservarEv() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/reserva/add`, {
                method: "POST",
                headers: { 'Content-Type': "application/json",'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    idEvent: events.id, idParticipante: events.criador
                })
            })
            if (!response.ok) {
                throw new Error(`erro no fetch : ${response.status}`)
            }
            console.log("reserva realizada  com sucesso")


        }
        catch (err) {
            console.error("erro ao realizar a reserva")
        }
    }
    return (
        <>


            {events &&
                <Card sx={{ width: 250, maxWidth: 250, flexDirection: "column", display: "flex", height: "20em", maxHeight: "20em", overflowY: editMode?"auto":"hidd" }}>
                    <CardContent>
                        {editMode ?
                            <>
                                <TextField size="small" value={name} onChange={(e) => setName(e.target.value)} />
                                <Box>
                                    <Typography label="Local">Local :</Typography>
                                    <TextField value={local} onChange={(e) => setLocal(e.target.value)} size="small" />
                                </Box>

                                <Box>
                                    <Typography label="Data">Data :</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>


                                        <DatePicker label="data" value={dayjs(date)} onChange={setDate} />




                                    </LocalizationProvider>

                                </Box>


                                <Box>
                                    <Typography label="Horário" >Horário : </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker label="horário" value={hora} ampm={false} onChange={setHora} />
                                    </LocalizationProvider>




                                </Box>

                                <Box>
                                    <Typography label="Capacidade">Capacidade : </Typography>
                                    <TextField value={capacidade} onChange={(e) => setCapacidade(e.target.value)} size="small" />
                                </Box>

                                <Box>
                                    <Typography label="Descrição">Descrição : </Typography>
                                    <TextField value={describe} onChange={(e) => setDescribe(e.target.value)} size="small" />


                                </Box>


                            </> :
                            <>
                                <Typography variant="h5"> {events.name}</Typography>

                                <Typography label="Local">Local : {events.local}</Typography>

                                <Typography label="Data">Data :{events.date}</Typography>

                                <Typography label="Horário" >Horário : {events.hora}</Typography>
                                <Typography label="Descrição">Descrição : {events.describe}</Typography>

                                <Typography label="Capacidade">Capacidade : {events.capacidade}</Typography>




                                <Box>
                                    <Typography label="Capacidade">Inscritos : {events.inscritos}</Typography>
                                    <Button onClick={() => setShowPart(prev => !prev)}>{showPart?"Esconder inscritos":"Mostrar inscritos"}</Button>
                                    {showPart && <Box sx={{ overflowX: "auto" }}>
                                        {events.participantes.map((p) => (
                                            <Typography key={p.id}> usuário  #{p.idParticipante}</Typography>
                                        ))}

                                    </Box>}

                                </Box>
                            </>




                        }




                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-around" }}>

                        <Button onClick={() => {
                           loadInfo()
                            setEditMode(edit => !edit)

                        }
                        } >{editMode ? "cancelar" : "editar"}</Button>

                        {editMode ?
                            <Button onClick={updateEvent} disabled={submit()}>confirmar</Button>
                            : <Button onClick={deleteEvent}>Remover</Button>}

                    </CardActions>
                </Card>}
        </>


    )
} export default EventItemAdm;