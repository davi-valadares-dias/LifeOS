import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [macrosHoje, setMacrosHoje] = useState({ calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
  const [saudacao, setSaudacao] = useState('');

  useEffect(() => {
    definirSaudacao();
    carregarMacrosDoDia();
  }, []);

  const definirSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) setSaudacao('Bom dia');
    else if (hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');
  };

  const carregarMacrosDoDia = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://lifeos-w4ik.onrender.com/api/nutricao/refeicoes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const refeicoes = await res.json();
      
      if (Array.isArray(refeicoes)) {
        // Filtra as refeições apenas do dia atual
        const hoje = new Date().toLocaleDateString('pt-BR');
        const refeicoesDeHoje = refeicoes.filter(ref => new Date(ref.data).toLocaleDateString('pt-BR') === hoje);
        
        let totais = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
        refeicoesDeHoje.forEach(ref => {
          totais.calorias += ref.totais.calorias || 0;
          totais.proteinas += ref.totais.proteinas || 0;
          totais.carboidratos += ref.totais.carboidratos || 0;
          totais.gorduras += ref.totais.gorduras || 0;
        });
        
        setMacrosHoje(totais);
      }
    } catch (erro) {
      console.error('Erro ao buscar resumo de macros', erro);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px', fontSize: '2.5rem' }}>{saudacao}!!</h1>
      <p style={{ color: '#aaa', marginBottom: '40px', fontSize: '1.1rem' }}>Aqui está o resumo do seu LifeOS hoje.</p>
      
      {/* CARD DE MACROS DA NUTRIÇÃO */}
      <div style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '10px', border: '1px solid #333', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#4ade80', fontSize: '1.5rem' }}> Nutrição de Hoje</h3>
          <Link to="/refeicoes" style={{ color: '#4ade80', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>
            Ver Diário →
          </Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
            <span style={{ display: 'block', color: '#f87171', fontSize: '1.8rem', fontWeight: 'bold' }}>{macrosHoje.calorias.toFixed(0)}</span>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Kcal Totais</span>
          </div>
          
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
            <span style={{ display: 'block', color: '#3b82f6', fontSize: '1.8rem', fontWeight: 'bold' }}>{macrosHoje.proteinas.toFixed(1)}g</span>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Proteínas</span>
          </div>
          
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
            <span style={{ display: 'block', color: '#fbbf24', fontSize: '1.8rem', fontWeight: 'bold' }}>{macrosHoje.carboidratos.toFixed(1)}g</span>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Carboidratos</span>
          </div>
          
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
            <span style={{ display: 'block', color: '#a855f7', fontSize: '1.8rem', fontWeight: 'bold' }}>{macrosHoje.gorduras.toFixed(1)}g</span>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Gorduras</span>
          </div>
        </div>
      </div>

      {/* GRADE DE ACESSO RÁPIDO AOS MÓDULOS */}
      <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.5rem' }}> Acesso Rápido</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        
        <Link to="/chat" style={estiloCard}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></span>
          Assistente IA
        </Link>
        
        <Link to="/tarefas" style={estiloCard}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></span>
          Tarefas
        </Link>
        
        <Link to="/financeiro" style={estiloCard}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></span>
          Finanças
        </Link>
        
        <Link to="/treinos" style={estiloCard}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></span>
          Diário de Treinos
        </Link>
        
        <Link to="/estudos" style={estiloCard}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></span>
          Faculdade
        </Link>
        
        <Link to="/projetos" style={estiloCard}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></span>
          Projetos
        </Link>

      </div>
    </div>
  );
}

// Estilo isolado para os cards de navegação para manter o código limpo
const estiloCard = {
  backgroundColor: '#1e1e1e',
  padding: '25px 20px',
  borderRadius: '10px',
  border: '1px solid #333',
  color: '#fff',
  textDecoration: 'none',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

export default Dashboard;