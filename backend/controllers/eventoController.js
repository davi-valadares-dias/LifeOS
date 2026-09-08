const Evento = require('../models/Evento');

const criarEvento = async (req, res) => {
  try {
    const novoEvento = new Evento(req.body);
    const eventoSalvo = await novoEvento.save();
    res.status(201).json(eventoSalvo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar evento', erro: erro.message });
  }
};

const listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ data: 1 }); // Ordena do mais próximo ao mais distante
    res.status(200).json(eventos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar eventos', erro: erro.message });
  }
};

const apagarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    await Evento.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Evento apagado!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar evento', erro: erro.message });
  }
};

module.exports = { criarEvento, listarEventos, apagarEvento };