const Evento = require('../models/Evento');

const criarEvento = async (req, res) => {
  try {
    const novoEvento = await Evento.create({ 
      ...req.body, 
      usuarioId: req.usuario.id 
    });
    res.status(201).json(novoEvento);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar evento', erro: erro.message });
  }
};

const listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find({ usuarioId: req.usuario.id }).sort({ data: 1 });
    res.status(200).json(eventos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar eventos', erro: erro.message });
  }
};

const apagarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const apagado = await Evento.findOneAndDelete({ _id: id, usuarioId: req.usuario.id });
    if (!apagado) return res.status(404).json({ mensagem: 'Não encontrado ou acesso negado' });
    res.status(200).json({ mensagem: 'Evento apagado!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar evento', erro: erro.message });
  }
};

module.exports = { criarEvento, listarEventos, apagarEvento };