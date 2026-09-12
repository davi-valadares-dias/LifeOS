import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Sidebar from './components/Sidebar'; 
import Dashboard from './pages/Dashboard'; 
import Financeiro from './pages/Financeiro';
import Treinos from './pages/Treinos';
import Tarefas from './pages/Tarefas';
import Projetos from './pages/Projetos';
import Estudos from './pages/Estudos';
import Calendario from './pages/Calendario';
import ChatLifeOS from './pages/ChatLifeOS';
import Alimentos from './pages/Alimentos'; // <-- Tela importada
import Refeicoes from './pages/Refeicoes'; // <-- Tela importada

function App() {
  const [estaLogado, setEstaLogado] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setEstaLogado(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setEstaLogado(false);
  };

  if (!estaLogado) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {mostrarCadastro ? (
          <div>
            <Cadastro />
            <p style={{ textAlign: 'center', color: '#fff', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }} onClick={() => setMostrarCadastro(false)}>
              Já tem conta? Faça Login
            </p>
          </div>
        ) : (
          <Login 
            aoLogar={() => setEstaLogado(true)} 
            irParaCadastro={() => setMostrarCadastro(true)} 
          />
        )}
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      <div style={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', color: 'white', position: 'relative' }}>
        
        <button 
          onClick={handleLogout} 
          style={{ position: 'absolute', top: '20px', right: '30px', padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 1000 }}
        >
          Sair do Sistema
        </button>

        <Sidebar />
        
        <div style={{ marginLeft: '250px', padding: '30px', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/treinos" element={<Treinos />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/estudos" element={<Estudos />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/chat" element={<ChatLifeOS />} />
            <Route path="/alimentos" element={<Alimentos />} /> {/* <-- Rota adicionada */}
            <Route path="/refeicoes" element={<Refeicoes />} /> {/* <-- Rota adicionada */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;