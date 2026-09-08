import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/chat', label: 'Assistente IA' }, // <-- O Cérebro do projeto no menu!
    { path: '/financeiro', label: 'Financeiro' },
    { path: '/treinos', label: 'Treinos' },
    { path: '/tarefas', label: 'Tarefas' },
    { path: '/projetos', label: 'Projetos' },
    { path: '/estudos', label: 'Faculdade' },
    { path: '/calendario', label: 'Calendário' }
  ];

  return (
    <div style={{ width: '250px', backgroundColor: '#1e1e1e', height: '100vh', padding: '20px', borderRight: '1px solid #333', position: 'fixed' }}>
      <h2 style={{ color: 'white', marginBottom: '30px', textAlign: 'center' }}>LifeOS </h2>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '12px',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#4ade80' : '#ccc',
              backgroundColor: location.pathname === item.path ? '#2a2a2a' : 'transparent',
              borderRadius: '8px',
              fontWeight: location.pathname === item.path ? 'bold' : 'normal',
              transition: '0.2s'
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;