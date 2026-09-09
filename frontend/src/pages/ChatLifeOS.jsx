import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function ChatLifeOS() {
  const [mensagens, setMensagens] = useState([]);
  const [pergunta, setPergunta] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // Referência para fazer a tela rolar automaticamente para baixo
  const fimDoChatRef = useRef(null);

  useEffect(() => {
    carregarHistorico();
  }, []);

  // Rola a tela para baixo sempre que as mensagens mudam
  useEffect(() => {
    fimDoChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const carregarHistorico = async () => {
    try {
      const token = localStorage.getItem('token'); // Puxa o crachá do navegador
      const res = await fetch('http://localhost:5000/api/ia/historico', {
        headers: {
          'Authorization': `Bearer ${token}` // Mostra o crachá para o segurança
        }
      });
      const dados = await res.json();
      setMensagens(dados);
    } catch (erro) {
      toast.error('Erro ao carregar histórico');
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!pergunta.trim()) return;

    // Adiciona a mensagem do usuário na tela instantaneamente (ilusão de velocidade)
    const novaMensagemUsuario = { papel: 'user', texto: pergunta, _id: Date.now() };
    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    
    const textoEnviado = pergunta;
    setPergunta('');
    setCarregando(true);

    try {
      const token = localStorage.getItem('token'); // Puxa o crachá do navegador
      const res = await fetch('http://localhost:5000/api/ia', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Mostra o crachá para o segurança
        },
        body: JSON.stringify({ pergunta: textoEnviado })
      });
      
      const dados = await res.json();
      
      // Adiciona a resposta da IA na tela
      const novaMensagemIA = { papel: 'model', texto: dados.resposta, _id: Date.now() + 1 };
      setMensagens((prev) => [...prev, novaMensagemIA]);
    } catch (erro) {
      toast.error('O assistente está offline ou sem permissão.');
    } finally {
      setCarregando(false);
    }
  };

  const limparConversa = async () => {
    if (!window.confirm('Tem certeza que deseja apagar todo o histórico?')) return;
    
    try {
      const token = localStorage.getItem('token'); // Puxa o crachá do navegador
      await fetch('http://localhost:5000/api/ia/limpar', { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Mostra o crachá para o segurança
        }
      });
      setMensagens([]);
      toast.success('Conversa apagada!');
    } catch (erro) {
      toast.error('Erro ao limpar conversa');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Cabeçalho do Chat */}
      <div style={{ backgroundColor: '#1e1e1e', padding: '15px 25px', borderRadius: '10px 10px 0 0', border: '1px solid #333', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#a855f7', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
            IA
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Assistente LifeOS</h2>
            <span style={{ color: '#4ade80', fontSize: '0.85rem' }}>Online e integrado aos seus dados</span>
          </div>
        </div>
        <button onClick={limparConversa} style={{ backgroundColor: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Limpar Conversa
        </button>
      </div>

      {/* Área das Mensagens (Rolagem) */}
      <div style={{ flex: 1, backgroundColor: '#121212', borderLeft: '1px solid #333', borderRight: '1px solid #333', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {mensagens.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
            Nenhuma mensagem. Diga olá para o seu assistente!
          </div>
        )}

        {mensagens.map((msg) => (
          <div key={msg._id} style={{ display: 'flex', justifyContent: msg.papel === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ 
              maxWidth: '75%', 
              padding: '12px 18px', 
              borderRadius: '15px', 
              borderTopRightRadius: msg.papel === 'user' ? '0' : '15px',
              borderTopLeftRadius: msg.papel === 'model' ? '0' : '15px',
              backgroundColor: msg.papel === 'user' ? '#a855f7' : '#222',
              color: '#fff',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              {msg.texto}
            </div>
          </div>
        ))}
        
        {carregando && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ backgroundColor: '#222', color: '#888', padding: '12px 18px', borderRadius: '15px', borderTopLeftRadius: '0' }}>
              Digitando...
            </div>
          </div>
        )}
        
        {/* Âncora para rolar para baixo automaticamente */}
        <div ref={fimDoChatRef} />
      </div>

      {/* Área de Digitação (Rodapé) */}
      <div style={{ backgroundColor: '#1e1e1e', padding: '15px 25px', borderRadius: '0 0 10px 10px', border: '1px solid #333' }}>
        <form onSubmit={enviarMensagem} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={pergunta} 
            onChange={(e) => setPergunta(e.target.value)} 
            placeholder="Pergunte sobre seus compromissos, tarefas ou peça conselhos..." 
            style={{ flex: 1, padding: '15px', borderRadius: '25px', border: '1px solid #444', backgroundColor: '#222', color: 'white', outline: 'none', fontSize: '1rem' }}
            disabled={carregando}
          />
          <button 
            type="submit" 
            style={{ padding: '0 25px', cursor: carregando ? 'not-allowed' : 'pointer', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: 'bold', fontSize: '1rem' }}
            disabled={carregando}
          >
            Enviar
          </button>
        </form>
      </div>
      
    </div>
  );
}

export default ChatLifeOS;