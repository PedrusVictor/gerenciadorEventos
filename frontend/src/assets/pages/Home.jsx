import { Box } from "@mui/material"
import Typography from "@mui/material/Typography";

//página inicial
function Home() {
    return (
        <Box sx={{ display: "flex", flex: 1 ,"@media(max-width:500px)":{flexDirection:"column"}}}>
            <Box sx={{ display: "flex",flex:2, flexDirection: "column", justifyContent: "space-evenly" }}>
                <Typography variant="h2" color="deepskyblue" align="center">Bem vindo ao TaskAdd!</Typography>


                <Typography variant="h5" align="center">Aqui você pode criar eventos e participar</Typography>
            </Box>
            <Box sx={{display:"flex",flex:1,backgroundImage:`url('/static/tarefas.png')`,backgroundRepeat:"no-repeat",backgroundSize:"contain",backgroundPosition:"center"}} ></Box>
        </Box>

    )
} export default Home