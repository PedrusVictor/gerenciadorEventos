import { useState, useEffect, useContext } from "react"
import { Box, Button, Typography } from "@mui/material"
import EventItem from "../../components/EventItem"
import EventItemAdm from "../../components/EventItemAdm"
import { userContext } from "../../App";
function ControlAdm() {


    // const [user, setUser] = useState({"id":3,"name":"sds","login":"dsd","password":"121","type":"user"})
    const { user } = useContext(userContext)

    //const reservas = Array.from({length:20},(_,index)=>({title:"teste",local:"casa",date:'21/08/2024',time:"12hrs",capacidade:12,describe:"testando"}))
    const [reservas, setReservas] = useState([])

    const [eventosC, setEventosC] = useState([])

    const [showEvP, setShowEvP] = useState(false)//controlador para eventos participados
    const [showEvC, setShowEvC] = useState(false)//controlador para eventos criados pelo usuário

    //useEffect para carregar os eventos criados e participados
    useEffect(() => {
        async function loadDados() {

            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`http://localhost:3000/reservasp/${user.id}`,
                    {
                        headers:{"Authorization":`Bearer ${token}`}
                    }
                )
                if (!response.ok) {
                    throw new Error(`error no fetch:${response.status}`)
                }
                const data = await response.json()

                const responseEv = await fetch(`http://localhost:3000/eventsc/${user.id}`,
                    {
                        headers:{"Authorization":`Bearer ${token}`}
                    }
                )
                if (!responseEv.ok) {
                    throw new Error(`error no fetch:${responseEv.status}`)
                }
                const dataEv = await responseEv.json()
                setReservas(data)
                setEventosC(dataEv)


            }
            catch (error) {
                console.error("não foi possível carregar os dados", error)
            }

        }
        loadDados()
    }, [])

    return (
        <Box sx={{ display: "flex", flexDirection: "column",overflow:"hidden", flexWrap: "wrap", gap: "1em", padding: 1, width: "100%", "@media(max-width:500px)": { flexWrap: "nowrap" ,overflowY:"auto"} }}>
            <Box sx={{ flex: "1" }}>
                <Button onClick={()=>{setShowEvC(prev => !prev)
                    setShowEvP(false)}}>{showEvC?"esconder eventos criados":"mostrar eventos criados"}</Button>

                {showEvC && <Box sx={{ display: "flex", gap: "1em",flexWrap:"wrap", "@media(max-width:500px)": { flexDirection: "column",flexWrap:"nowrap" } }}>
                    {/** mostra ou esconde o bloco dos eventos criados pelo usuário */}
                    {eventosC.map((r) => (
                        <EventItemAdm key={r.id} events={r} seteventList={setEventosC} />
                    ))}
                </Box>}


            </Box>
            <Box sx={{ flex: "1" }}>
                <Button onClick={()=>{
                    setShowEvP(prev => !prev)
                    setShowEvC(false)}} >{showEvP?"esconder eventos participados":"mostrar eventos participados"}</Button>
                {showEvP&& <Box sx={{ display: "flex", gap: "1em",flexWrap:"wrap", "@media(max-width:500px)": { flexDirection: "column",alignItems:"center",flexWrap:"nowrap" } }}>
                   {/* mostra o bloco de reservas/eventos participados. é escondido pela showEvp */ }
                   {reservas.map((r) => (
                       <EventItem key={r.id} events={r} reserva={true} seteventList={setReservas} setReserva={setReservas} />
                   ))}
               </Box>}
               


            </Box>

        </Box>


    )
} export default ControlAdm