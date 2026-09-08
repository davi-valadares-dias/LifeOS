import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import toast from 'react-hot-toast';

function Calendario() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Compromisso');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/eventos');
      const dados = await res.json();
      setEventos(dados);
    } catch (erro) {
      toast.error('Erro ao carregar eventos!');
      console.error(erro);
    }
  };

  const salvarEvento = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          titulo, 
          tipo, 
          descricao, 
          data: dataSelecionada // Salva na data que você clicou no calendário
        })
      });
      
      setTitulo('');
      setDescricao('');
      carregarEventos();
      toast.success('Evento marcado com sucesso! 📅'); // <-- O Toast em ação!
    } catch (erro) {
      toast.error('Erro ao salvar evento!');
    }
  };

  const deletarEvento = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/eventos/${id}`, { method: 'DELETE' });
      carregarEventos();
      toast.success('Evento apagado!'); // <-- Toast de deleção
    } catch (erro) {
      toast.error('Erro ao apagar evento!');
    }
  };

  // Filtra os eventos para mostrar apenas os do dia clicado
  const eventosDoDia = eventos.filter(evento => {
    const dataEvento = new Date(evento.data);
    return dataEvento.toDateString() === dataSelecionada.toDateString();
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      
      {/* CSS para forçar o Calendário a ficar com tema Escuro */}
      <style>{`
        .react-calendar { background-color: #1e1e1e; color: white; border: 1px solid #333; border-radius: 10px; padding: 15px; width: 100%; max-width: 400px; font-family: Arial, sans-serif; }
        .react-calendar__navigation button { color: white; font-size: 1.2rem; font-weight: bold; }
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: #333; border-radius: 5px; }
        .react-calendar__month-view__days__day { color: #ccc; }
        .react-calendar__month-view__days__day:enabled:hover, .react-calendar__month-view__days__day:enabled:focus { background-color: #3b82f6; color: white; border-radius: 5px; }
        .react-calendar__tile--active { background-color: #3b82f6 !important; color: white; border-radius: 5px; }
        .react-calendar__tile--now { background-color: #a855f7; border-radius: 5px; color: white; }
      `}</style>

      {/* LADO ESQUERDO: Calendário */}
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h1 style={{ marginBottom: '20px', fontSize: '2rem' }}>Calendário </h1>
        <Calendar 
          onChange={setDataSelecionada} 
          value={dataSelecionada} 
        />
        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#888' }}>
          * Selecione um dia no calendário para ver ou adicionar eventos. O dia atual está em roxo.
        </div>
      </div>

      {/* LADO DIREITO: Eventos do dia selecionado e Formulário */}
      <div style={{ flex: '1.5', minWidth: '350px', backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          Agenda: {dataSelecionada.toLocaleDateString('pt-BR')}
        </h2>

        {/* Formulário para adicionar evento no dia clicado */}
        <form onSubmit={salvarEvento} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título (ex: Prova de Lógica)" required style={{ flex: 2, padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }} />
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}>
              <option value="Compromisso">Compromisso</option>
              <option value="Prova">Prova</option>
              <option value="Lembrete">Lembrete</option>
            </select>
          </div>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes (opcional)" rows="2" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#222', color: 'white', resize: 'vertical' }} />
          <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Adicionar à Agenda</button>
        </form>

        {/* Lista de eventos do dia */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {eventosDoDia.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Nenhum evento para este dia.</p>
          ) : (
            eventosDoDia.map(item => (
              <div key={item._id} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', borderLeft: `5px solid ${item.tipo === 'Prova' ? '#f87171' : item.tipo === 'Lembrete' ? '#fbbf24' : '#4ade80'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block' }}>{item.titulo}</strong>
                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{item.tipo}</span>
                  {item.descricao && <p style={{ color: '#ddd', fontSize: '0.9rem', margin: '5px 0 0 0' }}>{item.descricao}</p>}
                </div>
                <button onClick={() => deletarEvento(item._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Calendario;