import { Outlet, Link } from "react-router-dom"

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useContext } from "react";
import { userContext } from "../App";

function Navbar() {

    //função de logout exportada através do userContext
    const { user, logout } = useContext(userContext)
    

//navbar com botão de login ou logout. o login redireciona para página de login

    return (


        <Box sx={{ display: "flex", flexDirection: "row" }} >

            <AppBar position="sticky" display="flex">

                <Toolbar sx={{ justifyContent: "space-between", "@media(max-width:500px)": { flexDirection: "column", flex: 1, fontSize: "0.1em" } }}>


                    <Box sx={{ gap: "2em", display: "flex", "@media(max-width:500px)": { flexDirection: "column" } }}>
                        <Typography variant="h6" sx={{ color: "white", textDecoration: "none" }} component={Link} to="/">
                            home
                        </Typography>
                        {user && user.type == "adm" && <Typography variant="h6" sx={{ color: "white", textDecoration: "none" }} component={Link} to="/formevent">
                            Add Event
                        </Typography>}

                        <Typography variant="h6" sx={{ color: "white", textDecoration: "none" }} component={Link} to="/event">
                            Eventos
                        </Typography>
                        <Typography variant="h6" sx={{ color: "white", textDecoration: "none" }} component={Link} to="/control">
                            Usuário
                        </Typography>
                    </Box>




                    {user ? <Button color="inherit"  onClick={logout} >Logout</Button>
                        : <Button color="inherit" component={Link} to="/login">Login</Button>}


                </Toolbar>

            </AppBar>

            <Outlet />
           

        </Box>
    )
} export default Navbar