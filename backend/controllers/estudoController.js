const Estudo = require('../models/Estudo');

const criarDisciplina = async (req, res) => {
  try {
    const novaDisciplina = new Estudo(req.body);
    const disciplinaSalva = await novaDisciplina.save();
    res.status(201).json(disciplinaSalva);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar', erro: erro.message });
  }
};

const listarDisciplinas = async (req, res) => {
  try {
    const disciplinas = await Estudo.find();
    res.status(200).json(disciplinas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar', erro: erro.message });
  }
};

// Permite somar faltas ou mudar o status para "Aprovado/Reprovado"
const atualizarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const disciplinaAtualizada = await Estudo.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(disciplinaAtualizada);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar', erro: erro.message });
  }
};

const apagarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    await Estudo.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Apagado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar', erro: erro.message });
  }
};

module.exports = { criarDisciplina, listarDisciplinas, atualizarDisciplina, apagarDisciplina };