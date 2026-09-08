const Tarefa = require('../models/Tarefa');

const criarTarefa = async (req, res) => {
  try {
    const { titulo, categoria } = req.body;
    const novaTarefa = new Tarefa({ titulo, categoria });
    const tarefaSalva = await novaTarefa.save();
    res.status(201).json(tarefaSalva);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar tarefa', erro: erro.message });
  }
};

const listarTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.find().sort({ dataCriacao: -1 });
    res.status(200).json(tarefas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas', erro: erro.message });
  }
};

// Nova função: Atualiza o status da tarefa (ex: de Pendente para Concluída)
const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true } // Retorna a tarefa já com o dado novo
    );
    res.status(200).json(tarefaAtualizada);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar status', erro: erro.message });
  }
};

const apagarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    await Tarefa.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Tarefa apagada com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar tarefa', erro: erro.message });
  }
};

module.exports = {
  criarTarefa,
  listarTarefas,
  atualizarStatus,
  apagarTarefa
};