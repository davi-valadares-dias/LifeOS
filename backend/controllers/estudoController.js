const Estudo = require('../models/Estudo');

const criarDisciplina = async (req, res) => {
  try {
    const novaDisciplina = await Estudo.create({ 
      ...req.body, 
      usuarioId: req.usuario.id 
    });
    res.status(201).json(novaDisciplina);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar', erro: erro.message });
  }
};

const listarDisciplinas = async (req, res) => {
  try {
    const disciplinas = await Estudo.find({ usuarioId: req.usuario.id });
    res.status(200).json(disciplinas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar', erro: erro.message });
  }
};

const atualizarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const disciplinaAtualizada = await Estudo.findOneAndUpdate(
      { _id: id, usuarioId: req.usuario.id }, 
      req.body, 
      { new: true }
    );
    if (!disciplinaAtualizada) return res.status(404).json({ mensagem: 'Não encontrado ou acesso negado' });
    res.status(200).json(disciplinaAtualizada);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar', erro: erro.message });
  }
};

const apagarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const apagado = await Estudo.findOneAndDelete({ _id: id, usuarioId: req.usuario.id });
    if (!apagado) return res.status(404).json({ mensagem: 'Não encontrado ou acesso negado' });
    res.status(200).json({ mensagem: 'Apagado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar', erro: erro.message });
  }
};

module.exports = { criarDisciplina, listarDisciplinas, atualizarDisciplina, apagarDisciplina };