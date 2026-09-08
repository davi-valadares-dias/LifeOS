import { useState, useEffect } from 'react';

function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [linkGithub, setLinkGithub] = useState('');

  useEffect(() => {
    carregarProjetos();
  }, []);

  const carregarProjetos = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/projetos');
      const dados = await resposta.json();
      setProjetos(dados);
    } catch (erro) {
      console.error('Erro ao buscar projetos', erro);
    }
  };

  const salvarProjeto = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, tecnologias, linkGithub })
      });
      setNome('');
      setDescricao('');
      setTecnologias('');
      setLinkGithub('');
      carregarProjetos();
    } catch (erro) {
      console.error('Erro ao salvar', erro);
    }
  };

  const deletarProjeto = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/projetos/${id}`, { method: 'DELETE' });
      setProjetoSelecionado(null); // Volta para a grade se apagar o projeto aberto
      carregarProjetos();
    } catch (erro) {
      console.error('Erro ao deletar', erro);
    }
  };

  // --------------------------------------------------------
  // TELA 2: VISÃO DETALHADA DO PROJETO
  // --------------------------------------------------------
  if (projetoSelecionado) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => setProjetoSelecionado(null)}
          style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ⬅ Voltar para Galeria
        </button>

        <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '10px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>{projetoSelecionado.nome}</h1>
            <button onClick={() => deletarProjeto(projetoSelecionado._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }} title="Apagar Projeto">🗑️</button>
          </div>
          
          <div style={{ marginBottom: '20px', color: '#a855f7', fontWeight: 'bold' }}>
            🛠️ {projetoSelecionado.tecnologias}
          </div>
          
          <p style={{ lineHeight: '1.6', color: '#ddd', whiteSpace: 'pre-wrap', marginBottom: '30px' }}>
            {projetoSelecionado.descricao}
          </p>
          
          {projetoSelecionado.linkGithub && (
            <a 
              href={projetoSelecionado.linkGithub} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '12px 20px', backgroundColor: '#2ea043', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              Ver no GitHub 🔗
            </a>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // TELA 1: FORMULÁRIO E GRADE DE CARDS
  // --------------------------------------------------------
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Portfólio </h1>

      <form onSubmit={salvarProjeto} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome (ex: Sistema ONG Adoção Animal)" required style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '200px' }} />
          <input type="text" value={tecnologias} onChange={(e) => setTecnologias(e.target.value)} placeholder="Tecnologias (ex: React, Node, CSS)" required style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', minWidth: '200px' }} />
        </div>
        <input type="url" value={linkGithub} onChange={(e) => setLinkGithub(e.target.value)} placeholder="Link do Repositório / GitHub (opcional)" style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição completa do projeto (objetivos, desafios, funcionalidades...)" required rows="4" style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', resize: 'vertical' }} />
        <button type="submit" style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Adicionar Projeto</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projetos.length === 0 && <p style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center' }}>Nenhum projeto cadastrado.</p>}
        {projetos.map((item) => (
          <div 
            key={item._id} 
            onClick={() => setProjetoSelecionado(item)} // Abre os detalhes ao clicar!
            style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333', cursor: 'pointer', transition: '0.2s', display: 'flex', flexDirection: 'column', gap: '10px' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
          >
            <h3 style={{ margin: 0, color: '#fff' }}>{item.nome}</h3>
            <span style={{ fontSize: '0.85rem', color: '#a855f7', fontWeight: 'bold' }}>{item.tecnologias}</span>
            <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.descricao}
            </p>
            <span style={{ fontSize: '0.85rem', color: '#666', marginTop: 'auto', paddingTop: '10px' }}>
              Clique para ver detalhes ➔
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projetos;