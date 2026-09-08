// Ajuste a linha 1 se o seu Model estiver com nome diferente (ex: '../models/treino')
const Treino = require('../models/Treino');

const registrarTreino = async (req, res) => {
  try {
    const novoTreino = new Treino(req.body);
    const treinoSalvo = await novoTreino.save();
    res.status(201).json(treinoSalvo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao registrar', erro: erro.message });
  }
};

const listarTreinos = async (req, res) => {
  try {
    const treinos = await Treino.find().sort({ data: -1 });
    res.status(200).json(treinos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar', erro: erro.message });
  }
};

// --- NOVA FUNÇÃO DE EDIÇÃO ---
const atualizarTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const treinoAtualizado = await Treino.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(treinoAtualizado);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar', erro: erro.message });
  }
};

const apagarTreino = async (req, res) => {
  try {
    const { id } = req.params;
    await Treino.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Treino apagado!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar', erro: erro.message });
  }
};

module.exports = { 
  registrarTreino, 
  listarTreinos, 
  atualizarTreino, // <-- Nova função exportada
  apagarTreino 
};