import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function Refeicoes() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [alimentosDB, setAlimentosDB] = useState([]);
  
  // Estado do formulário
  const [tipo, setTipo] = useState('Almoço');
  const [itens, setItens] = useState([{ alimentoId: '', quantidadeGramas: '' }]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const resRefeicoes = await fetch('http://localhost:5000/api/nutricao/refeicoes', { headers });
      setRefeicoes(await resRefeicoes.json());

      const resAlimentos = await fetch('http://localhost:5000/api/nutricao/alimentos', { headers });
      setAlimentosDB(await resAlimentos.json());
    } catch (erro) {
      console.error('Erro ao buscar dados', erro);
    }
  };

  const adicionarItemInput = () => {
    setItens([...itens, { alimentoId: '', quantidadeGramas: '' }]);
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...itens];
    novosItens[index][campo] = valor;
    setItens(novosItens);
  };

  const removerItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const salvarRefeicao = async (e) => {
    e.preventDefault();
    
    // Filtra itens vazios para evitar erros
    const itensValidos = itens.filter(i => i.alimentoId && i.quantidadeGramas);
    if (itensValidos.length === 0) {
      toast.error('Adicione pelo menos um alimento válido!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/nutricao/refeicoes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tipo, itens: itensValidos })
      });
      
      setTipo('Almoço');
      setItens([{ alimentoId: '', quantidadeGramas: '' }]);
      carregarDados();
      toast.success('Refeição registrada com sucesso!');
    } catch (erro) {
      toast.error('Erro ao registrar refeição');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Diário de Refeições 🍽️</h1>

      <form onSubmit={salvarRefeicao} style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '10px', border: '1px solid #333', marginBottom: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#ccc', marginBottom: '8px' }}>Tipo de Refeição</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}>
            <option value="Café da manhã">Café da manhã</option>
            <option value="Lanche da manhã">Lanche da manhã</option>
            <option value="Almoço">Almoço</option>
            <option value="Lanche da tarde">Lanche da tarde</option>
            <option value="Jantar">Jantar</option>
            <option value="Ceia">Ceia</option>
            <option value="Pré-treino">Pré-treino</option>
            <option value="Pós-treino">Pós-treino</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          <label style={{ color: '#ccc' }}>Alimentos Consumidos</label>
          {itens.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                value={item.alimentoId} 
                onChange={(e) => atualizarItem(index, 'alimentoId', e.target.value)}
                required
                style={{ flex: 2, padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}
              >
                <option value="">Selecione um alimento...</option>
                {alimentosDB.map(alimento => (
                  <option key={alimento._id} value={alimento._id}>{alimento.nome}</option>
                ))}
              </select>
              <input 
                type="number" 
                placeholder="Gramas" 
                value={item.quantidadeGramas} 
                onChange={(e) => atualizarItem(index, 'quantidadeGramas', e.target.value)}
                required
                style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', maxWidth: '100px' }}
              />
              {itens.length > 1 && (
                <button type="button" onClick={() => removerItem(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>❌</button>
              )}
            </div>
          ))}
        </div>

        <button type="button" onClick={adicionarItemInput} style={{ padding: '10px 15px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
          + Adicionar outro alimento
        </button>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4ade80', color: '#121212', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
          Registrar Refeição
        </button>
      </form>

      <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>Histórico</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {refeicoes.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>Nenhuma refeição registrada hoje.</p>}
        {refeicoes.map(ref => (
          <div key={ref._id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #4ade80' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{ref.tipo}</strong>
              <span style={{ color: '#888' }}>{new Date(ref.data).toLocaleDateString('pt-BR')}</span>
            </div>
            
            <ul style={{ color: '#ccc', paddingLeft: '20px', marginBottom: '15px' }}>
              {ref.itens.map((item, i) => (
                <li key={i}>{item.quantidadeGramas}g de {item.nomeSnapshot}</li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: '#222', padding: '10px', borderRadius: '8px' }}>
              <span style={{ color: '#f87171', fontWeight: 'bold' }}>🔥 {ref.totais.calorias.toFixed(0)} kcal</span>
              <span style={{ color: '#3b82f6' }}>🥩 {ref.totais.proteinas.toFixed(1)}g</span>
              <span style={{ color: '#fbbf24' }}>🍞 {ref.totais.carboidratos.toFixed(1)}g</span>
              <span style={{ color: '#a855f7' }}>🥑 {ref.totais.gorduras.toFixed(1)}g</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Refeicoes;