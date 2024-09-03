import { Box, Button } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'


import Signin from './assets/pages/Signin'
import Navbar from './components/Navbar'

import Home from './assets/pages/Home'
import Control from './assets/pages/Control'
import ControlAdm from './assets/pages/ControlAdm'
import EventList from './assets/pages/EventList'
import FormEvent from './assets/pages/FormEvent'

import './App.css'
import React, { useState, createContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';


//criando api context para compartilhar usuário
export const userContext = createContext()
function App() {

  //informações do usuário
  const [user, setUser] = useState(null)

  //token
  const token = localStorage.getItem('token');
  //width usada para desativar o botão de que esconde a navbar  na versão pc
  const [width, setWidth] = useState(window.innerWidth)
  const [showtab, setShowTab] = useState(true)//variavel para controlar o desativar/ativar da barra de navegação


  //informações o usuário são carregadas
  const loadUser = (token) => {

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, login: decoded.login, type: decoded.type })
      } catch (error) {
        console.error('Erro ao decodificar o token', error);
      }
    }



  }

  //colocando o userEffect para ativar o carregamento de dados do usuário quando mudar o tamanho da janela
  
  useEffect(() => {
    const Resize = () => {
      setWidth(window.innerWidth)
      setShowTab(true)
    }


    window.addEventListener("storage", loadUser(token))
    window.addEventListener("resize", Resize)
    return () => {
      window.removeEventListener("storage", loadUser(token))
      window.removeEventListener("resize", Resize)
    }




  }, [])


  //verificar se o usuário é autenticado/logado
  function isAuthenticated() {

    if (!token) return false;

    try {
      const decoded = jwtDecode(token);


      return decoded.exp > Date.now() / 1000; // Verifica se o token ainda é válido
    } catch (error) {
      return false;
    }
  }

  //função para deslogar o usuário. ela deixa o usuário como null e limpa o local storage

  function logout() {
    setUser(null)
    localStorage.clear()
  }


  //função para proteger rotas quando o usuário não estiver logado, e o direciona para a tela de login
  function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {

      return <Navigate to="/login" />;
    }

    return children;
  }


  //função para proteger a rota de adm
  function ProtectAdmRoute({ children }) {
    if (user && user.type != "adm") {
      return <Navigate to="/" />
    }
    return children;
  }


  //roteamento e box para comportar as páginas
  return (
    <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1, "@media(max-width:500px)": { flexDirection: "row", gap: "1em" } }}>


      <userContext.Provider value={{ user: user, setUser: setUser, logout: logout, loadUser: loadUser }}>
        <BrowserRouter>


          <Box display="flex" sx={{ backgroundColor: "#1976d2", flexDirection: "column", "@media(max-width:500px)": { flexDirection: "row" } }}>
            {showtab && <Navbar />}
            {width < 700 && <Button size='small' sx={{ color: "white", minWidth: "1em" }} onClick={() => setShowTab(prev => !prev)}>
              {showtab ? "<<" : ">>"}
            </Button>}


          </Box>
          <Box sx={{ display: "flex", flex: 1, justifyContent: "center", overflow: "hidden" }}>
            <Routes>

              <Route path='/login' element={<Signin />}></Route>
              <Route path='/control' element={<ProtectedRoute>{user ? user.type == "adm" ? <ControlAdm /> : <Control /> : ""} </ProtectedRoute>}></Route>

              <Route path="/formevent" element={<ProtectedRoute><ProtectAdmRoute><FormEvent /></ProtectAdmRoute>   </ProtectedRoute>}></Route>

              <Route path='/' default element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
              <Route path='/event' element={<ProtectedRoute><EventList /></ProtectedRoute>}></Route>
            </Routes>
          </Box>

        </BrowserRouter>

      </userContext.Provider>


    </Box>


  )
}

export default App
