import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [lancamentos, setLancamentos] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem('token'); // Puxa o crachá
        const headers = { 'Authorization': `Bearer ${token}` }; // Monta a autorização uma vez só

        const resFinancas = await fetch('http://localhost:5000/api/financeiro', { headers });
        setLancamentos(await resFinancas.json());

        const resTreinos = await fetch('http://localhost:5000/api/treinos', { headers });
        setTreinos(await resTreinos.json());

        const resTarefas = await fetch('http://localhost:5000/api/tarefas', { headers });
        setTarefas(await resTarefas.json());

        const resProjetos = await fetch('http://localhost:5000/api/projetos', { headers });
        setProjetos(await resProjetos.json());
      } catch (erro) {
        console.error('Erro ao buscar dados para o dashboard', erro);
      }
    };
    carregarDados();
  }, []);

  const totalEntradas = lancamentos.filter(i => i.tipo === 'entrada').reduce((acc, i) => acc + i.valor, 0);
  const totalSaidas = lancamentos.filter(i => i.tipo === 'saida').reduce((acc, i) => acc + i.valor, 0);
  const saldo = totalEntradas - totalSaidas;
  
  const ultimasFinancas = lancamentos.slice(0, 4);
  const ultimosTreinos = treinos.slice(0, 4);
  const tarefasPendentes = tarefas.filter(t => t.status !== 'Concluída').slice(0, 5);
  const ultimosProjetos = projetos.slice(0, 3);

  const dadosGrafico = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [totalEntradas, totalSaidas],
        backgroundColor: ['#4ade80', '#f87171'],
        borderColor: ['#22c55e', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const opcoesGrafico = {
    plugins: {
      legend: {
        labels: { color: '#ccc' }
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Visão Geral</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ccc', fontSize: '1rem' }}>Total de Receitas</h3>
            <strong style={{ fontSize: '1.8rem', color: '#4ade80' }}>R$ {totalEntradas.toFixed(2)}</strong>
          </div>
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ccc', fontSize: '1rem' }}>Total de Despesas</h3>
            <strong style={{ fontSize: '1.8rem', color: '#f87171' }}>R$ {totalSaidas.toFixed(2)}</strong>
          </div>
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ccc', fontSize: '1rem' }}>Saldo Atual</h3>
            <strong style={{ fontSize: '1.8rem', color: saldo >= 0 ? '#4ade80' : '#f87171' }}>R$ {saldo.toFixed(2)}</strong>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ccc', fontSize: '1.1rem' }}>Distribuição Financeira</h3>
          <div style={{ width: '200px', height: '200px' }}>
            {totalEntradas === 0 && totalSaidas === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>Sem dados</p>
            ) : (
              <Doughnut data={dadosGrafico} options={opcoesGrafico} />
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Últimas Finanças</h2>
          {ultimasFinancas.length === 0 ? <p style={{ color: '#888' }}>Nenhuma atividade.</p> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {ultimasFinancas.map(item => (
                <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #2a2a2a' }}>
                  <span>{item.descricao}</span>
                  <strong style={{ color: item.tipo === 'entrada' ? '#4ade80' : '#f87171' }}>
                    {item.tipo === 'saida' ? '-' : '+'} R$ {item.valor.toFixed(2)}
                  </strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Foco do Dia</h2>
            <Link to="/tarefas" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>Ver todas</Link>
          </div>
          {tarefasPendentes.length === 0 ? <p style={{ color: '#888' }}>Tudo em dia!</p> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tarefasPendentes.map(item => (
                <li key={item._id} style={{ padding: '10px 0', borderBottom: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff' }}>{item.titulo}</span>
                  <span style={{ color: item.status === 'Em Andamento' ? '#fbbf24' : '#f87171', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Últimos Treinos</h2>
          {ultimosTreinos.length === 0 ? <p style={{ color: '#888' }}>Nenhum treino.</p> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {ultimosTreinos.map(item => (
                <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #2a2a2a' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ color: '#ddd' }}>{item.grupoMuscular}</strong>
                    <small style={{ color: '#888', marginTop: '4px' }}>{new Date(item.data).toLocaleDateString('pt-BR')}</small>
                  </div>
                  <strong style={{ color: '#3b82f6', backgroundColor: '#1e3a8a', padding: '6px 12px', borderRadius: '8px' }}>{item.duracaoMinutos} min</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;