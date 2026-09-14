const Treino = require('../models/Treino');

const listarTreinos = async (req, res) => {
  try {
    const treinos = await Treino.find({ usuarioId: req.usuario.id }).sort({ data: -1 });
    res.status(200).json(treinos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar treinos', erro: erro.message });
  }
};

const criarTreino = async (req, res) => {
  try {
    const novoTreino = await Treino.create({ ...req.body, usuarioId: req.usuario.id });
    res.status(201).json(novoTreino);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar treino', erro: erro.message });
  }
};

const atualizarTreino = async (req, res) => {
  try {
    const atualizado = await Treino.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.usuario.id },
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ mensagem: 'Treino não encontrado ou acesso negado' });
    res.status(200).json(atualizado);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar treino', erro: erro.message });
  }
};

const excluirTreino = async (req, res) => {
  try {
    const deletado = await Treino.findOneAndDelete({ _id: req.params.id, usuarioId: req.usuario.id });
    if (!deletado) return res.status(404).json({ mensagem: 'Treino não encontrado ou acesso negado' });
    res.status(200).json({ mensagem: 'Treino excluído com sucesso' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao excluir treino', erro: erro.message });
  }
};

module.exports = { listarTreinos, criarTreino, atualizarTreino, excluirTreino };