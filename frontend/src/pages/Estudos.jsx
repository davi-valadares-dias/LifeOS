import { useState, useEffect } from 'react';

function Estudos() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [maxFaltas, setMaxFaltas] = useState('');

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/estudos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDisciplinas(await res.json());
    } catch (erro) {
      console.error('Erro ao buscar disciplinas', erro);
    }
  };

  const salvarDisciplina = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/estudos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ disciplina, professor, maxFaltas: Number(maxFaltas) })
      });
      setDisciplina(''); setProfessor(''); setMaxFaltas('');
      carregarDisciplinas();
    } catch (erro) {
      console.error('Erro ao salvar', erro);
    }
  };

  const adicionarFalta = async (id, faltasAtuais) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/estudos/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ faltas: faltasAtuais + 1 })
      });
      carregarDisciplinas();
    } catch (erro) {
      console.error('Erro ao adicionar falta', erro);
    }
  };

  const deletarDisciplina = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/estudos/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      carregarDisciplinas();
    } catch (erro) {
      console.error('Erro ao deletar', erro);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Faculdade </h1>

      <form onSubmit={salvarDisciplina} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
        <input type="text" value={disciplina} onChange={(e) => setDisciplina(e.target.value)} placeholder="Disciplina (ex: Estrutura de Dados)" required style={{ flex: 2, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '200px' }} />
        <input type="text" value={professor} onChange={(e) => setProfessor(e.target.value)} placeholder="Professor" style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '150px' }} />
        <input type="number" value={maxFaltas} onChange={(e) => setMaxFaltas(e.target.value)} placeholder="Máx. Faltas" required style={{ width: '120px', padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        <button type="submit" style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Cadastrar</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {disciplinas.map((item) => {
          const riscoFaltas = (item.faltas / item.maxFaltas) * 100;
          const corRisco = riscoFaltas > 80 ? '#f87171' : riscoFaltas > 50 ? '#fbbf24' : '#4ade80';

          return (
            <div key={item._id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: `1px solid ${corRisco}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{item.disciplina}</strong>
                <button onClick={() => deletarDisciplina(item._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>🗑️</button>
              </div>
              <span style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>Prof: {item.professor || 'N/A'}</span>
              
              <div style={{ marginTop: 'auto', backgroundColor: '#222', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#ddd' }}>Faltas: <strong>{item.faltas}</strong> / {item.maxFaltas}</span>
                  <button onClick={() => adicionarFalta(item._id, item.faltas)} style={{ backgroundColor: '#444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Falta</button>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(riscoFaltas, 100)}%`, backgroundColor: corRisco, transition: '0.3s' }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Estudos;