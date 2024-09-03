import { Box,Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState, useEffect, useContext } from "react";
import EventItem from "../../components/EventItem";
import { userContext } from "../../App";

//painel de controle do usuário comum
//vai mostrar os eventos em que participa e dá a possibilidade de desfazer a reserva
function Control() {

    //const [user, setUser] = useState({"id":3,"name":"sds","login":"dsd","password":"121","type":"user"})
    const { user } = useContext(userContext)

    //const reservas = Array.from({length:20},(_,index)=>({title:"teste",local:"casa",date:'21/08/2024',time:"12hrs",capacidade:12,describe:"testando"}))
    const [reservas, setReservas] = useState([])

    const [showEv, setShowEv] = useState(false)//usestate para controlar o hide/show dos eventos

    //useEffect para carregar os dados dos eventos participados
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
                setReservas(data)
                console.log(data)
            }
            catch (error) {
                console.error("erro ao buscar reservas", error)
            }

        }
        loadDados()
    }, [])

    return (
        <Box sx={{flex:1,display:"flex",flexDirection:"column","@media(max-width:500px)": { overflowY: "auto", } }}>
            <Button onClick={() => setShowEv(prev => !prev)}>{showEv?"esconder eventos participados":"mostrar eventos participados"}</Button>

            {showEv&&
             <Box display="flex" gap="1em" flexWrap="wrap" padding={1} justifyContent="center" sx={{ "@media(max-width:500px)": {flexDirection:"column",flexWrap:"nowrap",alignItems:"center"} }}>

             {reservas.map((r) => (
                 <EventItem key={e.id} events={r} reserva={true} seteventList={setReservas} setReserva={setReservas} />
             ))}

         </Box>}
           
        </Box>

    )
} export default Control;