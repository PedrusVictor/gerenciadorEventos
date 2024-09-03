import { Card, Button, TextField, CardContent, CardActions, Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useState, useContext } from "react";


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { parse } from 'date-fns';
import dayjs from "dayjs";
import { userContext } from "../App";
function EventItem({ events, seteventList, reserva, setReserva }) {

    //const [user, setUser] = useState({"id":3,"name":"sds","login":"dsd","password":"121","type":"user"})

    const { user } = useContext(userContext)
    const [editMode, setEditMode] = useState(false)
    const [local, setLocal] = useState("")
    const [date, setDate] = useState(null)
    const [hora, setHora] = useState(null)
    const [capacidade, setCapacidade] = useState(0)
    const [describe, setDescribe] = useState("")
    const [name, setName] = useState("")




    const loadInfo = () => {
        setName(events.name)
        setDate(events.date)
        setLocal(events.local)


        setHora(parse(events.hora, "HH:mm", new Date()))

        //setHora( parse(events.hora, "HH:mm", new Date()))
        setCapacidade(events.capacidade)
        setDescribe(events.describe)



    }

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
                headers:{'Authorization': `Bearer ${token}`},
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
                name: name, date: date.format("YYYY-MM-DD"), hora: hora.format("HH:mm"), local: local, capacidade: capacidade, describe: describe
            }
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
            seteventList(prev => prev.map((e) => e.id === events.id ? { id: events.id, name: name, date: date.format("YYYY-MM-DD"), hora: hora.format("HH:mm"), local: local, capacidade: capacidade, describe: describe, criador: events.criador } : e))

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
                headers: { 'Content-Type': "application/json", 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    idEvent: events.id, idParticipante: user.id
                })
            })
            if (!response.ok) {
                throw new Error(`erro no fetch : ${response.status}`)
            }
            console.log("reserva realizada  com sucesso")
            //console.log(events)
            // setReserva(prev => prev.map(r => r.id==events.id?{id:r.id,name:r.name,date:r.date,hora:r.hora,local:r.local}:r))
            setReserva(prev => [...prev, events])

        }
        catch (err) {
            console.error("erro ao realizar a reserva")
        }
    }
    async function deleteReserva() {
        try {

            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/reserva/del`, {
                method: "DELETE",
                body: JSON.stringify({ idEvent: events.id, idUser: user.id }),
                headers: { 'Content-Type': "application/json", 'Authorization': `Bearer ${token}` }

            })
            if (!response.ok) {
                throw new Error(`erro no fetch : ${response.status}`)
            }
            console.log("reserva removida com sucesso!")
            setReserva(prev => prev.filter(r => r.id !== events.id))


        }
        catch (error) {
            console.error("erro ao remover evento")
        }
    }
    return (
        <>
            {events &&
                <Card sx={{ width: 250, maxWidth: 250, flexDirection: "column", display: "flex", height: "20em", maxHeight: "30em", overflowY: "auto", "@media(max-width)": {} }}>
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
                                        <TimePicker label="horário" value={dayjs(hora)} ampm={false} onChange={setHora} />
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

                                <Typography label="Capacidade">Capacidade : {events.capacidade}</Typography>

                                <Typography label="Descrição">Descrição : {events.describe}</Typography>
                            </>




                        }




                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-around" }}>

                        {reserva ?
                            <Button onClick={deleteReserva} >cancelar reserva</Button> :
                            <Button onClick={ReservarEv} >reservar</Button>}



                    </CardActions>
                </Card>}
        </>


    )
} export default EventItem;