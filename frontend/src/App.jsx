import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- Importando o Toaster
import Sidebar from './components/Sidebar';
import Financeiro from './pages/Financeiro';
import Dashboard from './pages/Dashboard';
import Treinos from './pages/Treinos';
import Tarefas from './pages/Tarefas';
import Projetos from './pages/Projetos';
import Estudos from './pages/Estudos';
import Calendario from './pages/Calendario';
import ChatLifeOS from './pages/ChatLifeOS'; 

function App() {
  return (
    <Router>
      {/* O Toaster fica aqui em cima, monitorando o app todo */}
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      <div style={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
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
            <Route path="/chat" element={<ChatLifeOS />} /> {/* <-- Nova rota */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;