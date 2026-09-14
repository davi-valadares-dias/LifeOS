import React, { useState } from 'react';
import toast from 'react-hot-toast';

function Login({ aoLogar, irParaCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://lifeos-w4ik.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Salva o token (crachá) no navegador
        localStorage.setItem('token', data.token);
        
        // 2. Avisa o sistema que logou
        aoLogar();
        
        // 3. A ALTERAÇÃO: Força o navegador a ir para a raiz do Dashboard, limpando a tela preta
        window.location.href = '/';
      } else {
        toast.error(data.mensagem || 'Erro ao fazer login.');
      }
    } catch (erro) {
      console.error("Erro no login:", erro);
      toast.error('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '10px', width: '350px', border: '1px solid #333' }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Entrar no LifeOS</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
          style={{ padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Entrar
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={irParaCadastro} 
          style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Ainda não tem conta? Cadastre-se
        </button>
      </div>
    </div>
  );
}

export default Login;