import { useState, useEffect } from 'react';

function Treinos() {
  const [treinos, setTreinos] = useState([]);
  
  const [grupoMuscular, setGrupoMuscular] = useState('');
  const [exerciciosFeitos, setExerciciosFeitos] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState('');
  
  // Controle de edição
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/treinos');
      const dados = await resposta.json();
      setTreinos(dados);
    } catch (erro) {
      console.error('Erro ao buscar treinos', erro);
    }
  };

  const salvarTreino = async (e) => {
    e.preventDefault(); 
    
    const dados = {
      grupoMuscular,
      exerciciosFeitos,
      duracaoMinutos: Number(duracaoMinutos)
    };

    try {
      if (editandoId) {
        await fetch(`http://localhost:5000/api/treinos/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        setEditandoId(null);
      } else {
        await fetch('http://localhost:5000/api/treinos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
      }
      
      setGrupoMuscular('');
      setExerciciosFeitos('');
      setDuracaoMinutos('');
      carregarTreinos(); 
    } catch (erro) {
      console.error('Erro ao salvar treino', erro);
    }
  };

  const prepararEdicao = (item) => {
    setGrupoMuscular(item.grupoMuscular);
    setExerciciosFeitos(item.exerciciosFeitos);
    setDuracaoMinutos(item.duracaoMinutos);
    setEditandoId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setGrupoMuscular('');
    setExerciciosFeitos('');
    setDuracaoMinutos('');
  };

  const deletarTreino = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/treinos/${id}`, { method: 'DELETE' });
      carregarTreinos(); 
    } catch (erro) {
      console.error('Erro ao deletar treino', erro);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px', fontSize: '2rem' }}>
        <span>Diário de Treinos</span>
        <span></span>
      </h1>
      
      <form onSubmit={salvarTreino} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: editandoId ? '1px solid #3b82f6' : '1px solid #333' }}>
        <input type="text" value={grupoMuscular} onChange={(e) => setGrupoMuscular(e.target.value)} placeholder="Grupo Muscular (ex: Costas e Bíceps)" required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        <textarea value={exerciciosFeitos} onChange={(e) => setExerciciosFeitos(e.target.value)} placeholder="Exercícios e Cargas (ex: Puxada 60kg, Remada 30kg)" required rows="3" style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', resize: 'vertical' }} />
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="number" value={duracaoMinutos} onChange={(e) => setDuracaoMinutos(e.target.value)} placeholder="Duração" required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', flex: 1 }} />
          <span style={{ color: '#aaa' }}>minutos</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '12px', cursor: 'pointer', backgroundColor: editandoId ? '#3b82f6' : '#2ea043', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
            {editandoId ? 'Atualizar Treino' : 'Registrar Treino'}
          </button>
          
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>Histórico de Esforço</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {treinos.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Nenhum treino registrado ainda. </p>}
        {treinos.map((item) => (
          <div key={item._id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <strong style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{item.grupoMuscular}</strong>
                <span style={{ fontSize: '0.85rem', backgroundColor: '#222', padding: '3px 8px', borderRadius: '12px', color: '#aaa' }}>⏱ {item.duracaoMinutos} min</span>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
              </div>
              <p style={{ color: '#ddd', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{item.exerciciosFeitos}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginLeft: '15px' }}>
              <button onClick={() => prepararEdicao(item)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Editar treino">✏️</button>
              <button onClick={() => deletarTreino(item._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#666' }} title="Apagar treino">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Treinos;