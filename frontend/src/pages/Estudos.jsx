import { useState, useEffect } from 'react';

function Estudos() {
  const [estudos, setEstudos] = useState([]);
  
  const [nome, setNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [faltas, setFaltas] = useState(0);
  
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarEstudos();
  }, []);

  const carregarEstudos = async () => {
    try {
      const token = localStorage.getItem('token');
      const resposta = await fetch('https://lifeos-w4ik.onrender.com/api/estudos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await resposta.json();
      setEstudos(dados);
    } catch (erro) {
      console.error('Erro ao buscar estudos', erro);
    }
  };

  const salvarEstudo = async (e) => {
    e.preventDefault(); 
    
    const dados = {
      nome,
      professor,
      faltas: Number(faltas)
    };
    const token = localStorage.getItem('token');

    try {
      if (editandoId) {
        await fetch(`https://lifeos-w4ik.onrender.com/api/estudos/${editandoId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dados)
        });
        setEditandoId(null);
      } else {
        await fetch('https://lifeos-w4ik.onrender.com/api/estudos', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dados)
        });
      }
      
      setNome('');
      setProfessor('');
      setFaltas(0);
      carregarEstudos(); 
    } catch (erro) {
      console.error('Erro ao salvar disciplina', erro);
    }
  };

  const prepararEdicao = (item) => {
    setNome(item.nome);
    setProfessor(item.professor || '');
    setFaltas(item.faltas || 0);
    setEditandoId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome('');
    setProfessor('');
    setFaltas(0);
  };

  const deletarEstudo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://lifeos-w4ik.onrender.com/api/estudos/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      carregarEstudos(); 
    } catch (erro) {
      console.error('Erro ao deletar disciplina', erro);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>
        Gerenciador de Estudos 
      </h1>
      
      <form onSubmit={salvarEstudo} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: editandoId ? '1px solid #3b82f6' : '1px solid #333' }}>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da Disciplina (ex: Banco de Dados)" required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        <input type="text" value={professor} onChange={(e) => setProfessor(e.target.value)} placeholder="Nome do Professor (opcional)" style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="number" value={faltas} onChange={(e) => setFaltas(e.target.value)} placeholder="Faltas" style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', flex: 1 }} />
          <span style={{ color: '#aaa' }}>faltas registradas</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '12px', cursor: 'pointer', backgroundColor: editandoId ? '#3b82f6' : '#2ea043', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
            {editandoId ? 'Atualizar Disciplina' : 'Adicionar Disciplina'}
          </button>
          
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>Disciplinas</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {estudos.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Nenhuma disciplina cadastrada ainda.</p>}
        {estudos.map((item) => (
          <div key={item._id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.2rem', color: '#3b82f6', display: 'block', marginBottom: '5px' }}>{item.nome}</strong>
              <span style={{ color: '#aaa', fontSize: '0.9rem', marginRight: '15px' }}>Prof: {item.professor || 'Não informado'}</span>
              <span style={{ fontSize: '0.85rem', backgroundColor: '#222', padding: '3px 8px', borderRadius: '12px', color: '#f87171' }}>Faltas: {item.faltas}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => prepararEdicao(item)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Editar">✏️</button>
              <button onClick={() => deletarEstudo(item._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Apagar">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Estudos;