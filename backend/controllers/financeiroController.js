const Lancamento = require('../models/Lancamento');

const listarLancamentos = async (req, res) => {
  try {
    const lancamentos = await Lancamento.find({ usuarioId: req.usuario.id }).sort({ data: -1 });
    res.status(200).json(lancamentos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
};

const criarLancamento = async (req, res) => {
  try {
    const novoLancamento = await Lancamento.create({ ...req.body, usuarioId: req.usuario.id });
    res.status(201).json(novoLancamento);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
};

const atualizarLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = await Lancamento.findOneAndUpdate(
      { _id: id, usuarioId: req.usuario.id }, 
      req.body, 
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ mensagem: 'Não encontrado ou sem permissão' });
    res.status(200).json(atualizado);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
};

const excluirLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deletado = await Lancamento.findOneAndDelete({ _id: id, usuarioId: req.usuario.id });
    if (!deletado) return res.status(404).json({ mensagem: 'Não encontrado ou sem permissão' });
    res.status(200).json({ mensagem: 'Excluído com sucesso' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
};

module.exports = { listarLancamentos, criarLancamento, atualizarLancamento, excluirLancamento };