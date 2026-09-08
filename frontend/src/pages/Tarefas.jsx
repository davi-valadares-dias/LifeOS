import { useState, useEffect } from 'react';

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/tarefas');
      const dados = await resposta.json();
      setTarefas(dados);
    } catch (erro) {
      console.error('Erro ao buscar tarefas', erro);
    }
  };

  const salvarTarefa = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, categoria })
      });
      setTitulo('');
      setCategoria('');
      carregarTarefas();
    } catch (erro) {
      console.error('Erro ao salvar tarefa', erro);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await fetch(`http://localhost:5000/api/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });
      carregarTarefas();
    } catch (erro) {
      console.error('Erro ao atualizar status', erro);
    }
  };

  const deletarTarefa = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tarefas/${id}`, { method: 'DELETE' });
      carregarTarefas();
    } catch (erro) {
      console.error('Erro ao deletar', erro);
    }
  };

  // Cores dinâmicas para cada status
  const corStatus = {
    'Pendente': '#f87171',
    'Em Andamento': '#fbbf24',
    'Concluída': '#4ade80'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>
        Tarefas e Projetos ✅
      </h1>

      <form onSubmit={salvarTarefa} style={{ display: 'flex', gap: '10px', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          placeholder="O que precisa ser feito?" 
          required 
          style={{ flex: 2, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '200px' }}
        />
        <input 
          type="text" 
          value={categoria} 
          onChange={(e) => setCategoria(e.target.value)} 
          placeholder="Categoria (ex: Faculdade, Pessoal)" 
          required 
          style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '150px' }}
        />
        <button type="submit" style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Adicionar
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {tarefas.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Sua lista está limpa. Nenhuma tarefa pendente!</p>}
        {tarefas.map((item) => (
          <div key={item._id} style={{ backgroundColor: '#1e1e1e', padding: '15px 20px', borderRadius: '10px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <strong style={{ fontSize: '1.2rem', textDecoration: item.status === 'Concluída' ? 'line-through' : 'none', color: item.status === 'Concluída' ? '#666' : '#fff' }}>
                {item.titulo}
              </strong>
              <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#888' }}>
                📁 {item.categoria}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <select 
                value={item.status} 
                onChange={(e) => atualizarStatus(item._id, e.target.value)}
                style={{ padding: '8px', borderRadius: '5px', backgroundColor: '#222', color: corStatus[item.status], border: `1px solid ${corStatus[item.status]}`, fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluída">Concluída</option>
              </select>
              
              <button onClick={() => deletarTarefa(item._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }} title="Apagar">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tarefas;