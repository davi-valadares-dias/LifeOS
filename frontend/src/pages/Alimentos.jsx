import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function Alimentos() {
  const [alimentos, setAlimentos] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [calorias, setCalorias] = useState('');
  const [proteinas, setProteinas] = useState('');
  const [carboidratos, setCarboidratos] = useState('');
  const [gorduras, setGorduras] = useState('');

  useEffect(() => {
    carregarAlimentos();
  }, []);

const carregarAlimentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/nutricao/alimentos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await res.json();
      
      if (Array.isArray(dados)) {
        setAlimentos(dados);
      } else {
        console.error("Back-end respondeu com erro:", dados);
      }
    } catch (erro) {
      console.error('Erro ao buscar alimentos', erro);
    }
  };

  const salvarAlimento = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/nutricao/alimentos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          nome, 
          categoria, 
          calorias: Number(calorias), 
          proteinas: Number(proteinas), 
          carboidratos: Number(carboidratos), 
          gorduras: Number(gorduras) 
        })
      });
      
      setNome(''); setCategoria(''); setCalorias(''); setProteinas(''); setCarboidratos(''); setGorduras('');
      carregarAlimentos();
      toast.success('Alimento adicionado à base!');
    } catch (erro) {
      toast.error('Erro ao salvar alimento');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Base de Alimentos 🍎</h1>

      <form onSubmit={salvarAlimento} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
        <h3 style={{ width: '100%', margin: '0 0 10px 0', color: '#3b82f6' }}>Novo Alimento (Valores para 100g)</h3>
        
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do Alimento" required style={{ flex: '1 1 200px', padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoria (ex: Fruta, Proteína)" required style={{ flex: '1 1 150px', padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        
        <div style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
          <input type="number" value={calorias} onChange={(e) => setCalorias(e.target.value)} placeholder="Kcal" required style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
          <input type="number" value={proteinas} onChange={(e) => setProteinas(e.target.value)} placeholder="Prot (g)" required style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
          <input type="number" value={carboidratos} onChange={(e) => setCarboidratos(e.target.value)} placeholder="Carb (g)" required style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
          <input type="number" value={gorduras} onChange={(e) => setGorduras(e.target.value)} placeholder="Gord (g)" required style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px 20px', cursor: 'pointer', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Cadastrar na Base</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
        {alimentos.map(item => (
          <div key={item._id} style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block' }}>{item.nome}</strong>
            <span style={{ color: '#a855f7', fontSize: '0.85rem' }}>{item.categoria}</span>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#aaa', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <span>🔥 {item.calorias} kcal</span>
              <span>🥩 {item.proteinas}g Prot</span>
              <span>🍞 {item.carboidratos}g Carb</span>
              <span>🥑 {item.gorduras}g Gord</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alimentos;