import React, { useState } from 'react';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem(''); // Limpa mensagens anteriores

    try {
      const resposta = await fetch('http://localhost:5000/api/auth/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem('✅ Conta criada com sucesso! Agora você pode fazer login.');
        // Limpa os campos após o sucesso
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        setMensagem(`❌ Erro: ${dados.mensagem}`);
      }
    } catch (erro) {
      setMensagem('❌ Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '8px' }}>
      <h2>Criar Conta - LifeOS</h2>
      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Seu Nome" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
        />
        <input 
          type="email" 
          placeholder="Seu E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
        />
        <input 
          type="password" 
          placeholder="Sua Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Registrar
        </button>
      </form>
      {mensagem && <p style={{ marginTop: '15px', textAlign: 'center' }}>{mensagem}</p>}
    </div>
  );
};

export default Cadastro;