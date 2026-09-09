import React, { useState } from 'react';

const Login = ({ aoLogar, irParaCadastro }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const resposta = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem('✅ Acesso liberado! Entrando...');
        // 1. Salva o crachá de segurança no navegador
        localStorage.setItem('token', dados.token);
        
        // 2. Avisa o sistema que o usuário logou (após 1 segundo)
        setTimeout(() => {
          aoLogar();
        }, 1000);
      } else {
        setMensagem(`❌ Erro: ${dados.mensagem}`);
      }
    } catch (erro) {
      setMensagem('❌ Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '8px' }}>
      <h2>Login - LifeOS</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
          Entrar
        </button>
      </form>
      {mensagem && <p style={{ marginTop: '15px', textAlign: 'center' }}>{mensagem}</p>}
      
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Não tem uma conta?{' '}
        <span 
          onClick={irParaCadastro} 
          style={{ color: '#4CAF50', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Cadastre-se
        </span>
      </p>
    </div>
  );
};

export default Login;