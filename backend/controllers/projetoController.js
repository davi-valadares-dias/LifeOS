const Projeto = require('../models/Projeto');

const criarProjeto = async (req, res) => {
  try {
    const novoProjeto = new Projeto(req.body);
    const projetoSalvo = await novoProjeto.save();
    res.status(201).json(projetoSalvo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar', erro: erro.message });
  }
};

const listarProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.find().sort({ dataCriacao: -1 });
    res.status(200).json(projetos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar', erro: erro.message });
  }
};

const apagarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    await Projeto.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Projeto apagado!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar', erro: erro.message });
  }
};

module.exports = { criarProjeto, listarProjetos, apagarProjeto };