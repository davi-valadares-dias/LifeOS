import { useState, useEffect } from 'react';

function Financeiro() {
  const [lancamentos, setLancamentos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('entrada');
  
  // Novo estado para controlar se estamos criando ou editando
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarLancamentos();
  }, []);

  const carregarLancamentos = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/financeiro');
      const dados = await resposta.json();
      setLancamentos(dados);
    } catch (erro) {
      console.error('Erro ao buscar lançamentos', erro);
    }
  };

  const salvarLancamento = async (e) => {
    e.preventDefault(); 
    
    const dados = { descricao, valor: Number(valor), tipo };

    try {
      if (editandoId) {
        // Se tem um ID em edição, faz um PUT para atualizar
        await fetch(`http://localhost:5000/api/financeiro/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        setEditandoId(null); // Sai do modo de edição
      } else {
        // Se não tem ID, faz um POST para criar
        await fetch('http://localhost:5000/api/financeiro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
      }
      
      setDescricao('');
      setValor('');
      setTipo('entrada');
      carregarLancamentos(); 
    } catch (erro) {
      console.error('Erro ao salvar lançamento', erro);
    }
  };

  // Função para puxar os dados do card para o formulário
  const prepararEdicao = (item) => {
    setDescricao(item.descricao);
    setValor(item.valor);
    setTipo(item.tipo);
    setEditandoId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo
  };

  const deletarLancamento = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/financeiro/${id}`, { method: 'DELETE' });
      carregarLancamentos(); 
    } catch (erro) {
      console.error('Erro ao deletar lançamento', erro);
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setDescricao('');
    setValor('');
    setTipo('entrada');
  };

  const totalEntradas = lancamentos.filter(i => i.tipo === 'entrada').reduce((acc, i) => acc + i.valor, 0);
  const totalSaidas = lancamentos.filter(i => i.tipo === 'saida').reduce((acc, i) => acc + i.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Painel Financeiro </h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
        <div><h3 style={{ margin: '0 0 10px 0', color: '#ccc' }}>Entradas</h3><strong style={{ fontSize: '1.5rem', color: '#4ade80' }}>R$ {totalEntradas.toFixed(2)}</strong></div>
        <div><h3 style={{ margin: '0 0 10px 0', color: '#ccc' }}>Saídas</h3><strong style={{ fontSize: '1.5rem', color: '#f87171' }}>R$ {totalSaidas.toFixed(2)}</strong></div>
        <div><h3 style={{ margin: '0 0 10px 0', color: '#ccc' }}>Saldo</h3><strong style={{ fontSize: '1.5rem', color: saldo >= 0 ? '#4ade80' : '#f87171' }}>R$ {saldo.toFixed(2)}</strong></div>
      </div>

      <form onSubmit={salvarLancamento} style={{ display: 'flex', gap: '10px', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: editandoId ? '1px solid #3b82f6' : '1px solid #333', flexWrap: 'wrap' }}>
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" required style={{ flex: 2, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '200px' }} />
        <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor (R$)" required style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '100px' }} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        
        <button type="submit" style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: editandoId ? '#3b82f6' : '#2ea043', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          {editandoId ? 'Atualizar' : 'Adicionar'}
        </button>

        {editandoId && (
          <button type="button" onClick={cancelarEdicao} style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            Cancelar
          </button>
        )}
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {lancamentos.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Nenhum lançamento registrado.</p>}
        {lancamentos.map((item) => (
          <div key={item._id} style={{ backgroundColor: '#1e1e1e', padding: '15px 20px', borderRadius: '8px', borderLeft: `5px solid ${item.tipo === 'entrada' ? '#4ade80' : '#f87171'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.2rem', color: '#fff', display: 'block', marginBottom: '5px' }}>{item.descricao}</strong>
              <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <strong style={{ fontSize: '1.2rem', color: item.tipo === 'entrada' ? '#4ade80' : '#f87171' }}>
                R$ {item.valor.toFixed(2)}
              </strong>
              <button onClick={() => prepararEdicao(item)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Editar">✏️</button>
              <button onClick={() => deletarLancamento(item._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Apagar">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Financeiro;