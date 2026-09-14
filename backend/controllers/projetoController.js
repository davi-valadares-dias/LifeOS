const Projeto = require('../models/Projeto');

const criarProjeto = async (req, res) => {
  try {
    const novoProjeto = await Projeto.create({ 
      ...req.body, 
      usuarioId: req.usuario.id 
    });
    res.status(201).json(novoProjeto);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar', erro: erro.message });
  }
};

const listarProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.find({ usuarioId: req.usuario.id }).sort({ dataCriacao: -1 });
    res.status(200).json(projetos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar', erro: erro.message });
  }
};

const apagarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const apagado = await Projeto.findOneAndDelete({ _id: id, usuarioId: req.usuario.id });
    if (!apagado) return res.status(404).json({ mensagem: 'Não encontrado ou acesso negado' });
    res.status(200).json({ mensagem: 'Projeto apagado!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar', erro: erro.message });
  }
};

module.exports = { criarProjeto, listarProjetos, apagarProjeto };