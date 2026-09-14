import React, { useState } from 'react';
import toast from 'react-hot-toast';

// A propriedade aoCadastrarSucesso é recebida aqui
function Cadastro({ aoCadastrarSucesso }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    
    try {
      // Ajuste esta rota caso o seu back-end use outro caminho (ex: /api/auth/register)
      const response = await fetch('http://localhost:5000/api/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso!');
        
        // Limpa os campos após o sucesso
        setNome('');
        setEmail('');
        setSenha('');

        // Se a função existir, ela é acionada para voltar para a tela de Login
        if (aoCadastrarSucesso) {
          aoCadastrarSucesso();
        }
      } else {
        toast.error(data.mensagem || 'Erro ao cadastrar.');
      }
    } catch (erro) {
      console.error("Erro no cadastro:", erro);
      toast.error('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '10px', width: '350px', border: '1px solid #333' }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Criar Conta</h2>
      
      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Seu Nome" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}
        />
        <input 
          type="email" 
          placeholder="Seu E-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}
        />
        <input 
          type="password" 
          placeholder="Sua Senha" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}
        />
        
        <button 
          type="submit" 
          style={{ padding: '12px', backgroundColor: '#4ade80', color: '#121212', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Cadastro;