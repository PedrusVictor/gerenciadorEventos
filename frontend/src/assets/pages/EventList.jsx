import { Box, Typography } from "@mui/material";
import EventItem from "../../components/EventItem";

import { useState, useEffect ,useContext} from "react";
import { userContext } from "../../App";
function EventList() {

    const {user} = useContext(userContext)
    // const events=Array.from({length:2},(_,index)=>({title:"teste",local:"casa",date:'21/08/2024',time:"12hrs",capacidade:12,describe:"testando"}))
    const [events, setEvents] = useState([])
    const [reservas,setReservas]=useState([])

    //pagina para listar os eventos não criados pelo usuário
    
    useEffect(() => {
        
        const loadData = async () => {


            try {
               
                const token = localStorage.getItem('token')
                const response = await fetch("http://localhost:3000/events",
                    {
                        headers:{"Authorization":`Bearer ${token}`}
                    }
                )
            
                const responseRes = await fetch(`http://localhost:3000/reservasp/${user.id}`,{
                    headers:{"Authorization":`Bearer ${token}`}
                })
                if (!response.ok||!responseRes.ok) {
                    throw new Error(`error no fetch:${response.status}`)
                }

                const data = await response.json()
                const evFilter = data.filter(r=>r.criador!=user.id)

               
               const datareserva= await responseRes.json()
               setReservas(datareserva)
                setEvents(evFilter)
               
            }
            catch (error) {
                console.error("erro ao buscar eventos", error)
            }

        }
        if(user){
            loadData()
        }
        
    }, [user])
    return (
        <Box width="100%" height="100%" display="flex" gap="1em" flexWrap="wrap" padding={1} sx={{"@media(max-width:500px)":{overflowY:"auto"}}}>
           
            {events.map((e) => (
               
             
                <EventItem key={e.id} events={e} seteventList={setEvents}  reserva={reservas.map(r=>r.id).includes(e.id)} setReserva={setReservas}/>
               
            ))}
        </Box>
    )
} export default EventList;