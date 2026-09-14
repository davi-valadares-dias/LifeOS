const Tarefa = require('../models/Tarefa');

// 1. LISTAR: Busca apenas as tarefas do usuário logado
const listarTarefas = async (req, res) => {
  try {
    const donoId = req.usuario.id;
    const tarefas = await Tarefa.find({ usuarioId: donoId }).sort({ dataCriacao: -1 });
    res.status(200).json(tarefas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas', erro: erro.message });
  }
};

// 2. CRIAR: Salva a nova tarefa colando a etiqueta do dono
const criarTarefa = async (req, res) => {
  try {
    const donoId = req.usuario.id;
    const novaTarefa = await Tarefa.create({ 
      ...req.body, 
      usuarioId: donoId 
    });
    res.status(201).json(novaTarefa);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar tarefa', erro: erro.message });
  }
};

// 3. ATUALIZAR: Confere se a tarefa existe E se pertence ao usuário
const atualizarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const donoId = req.usuario.id;

    const tarefaAtualizada = await Tarefa.findOneAndUpdate(
      { _id: id, usuarioId: donoId }, // Filtro duplo de segurança
      req.body,
      { new: true }
    );

    if (!tarefaAtualizada) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada ou acesso negado' });
    }
    res.status(200).json(tarefaAtualizada);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar tarefa', erro: erro.message });
  }
};

// 4. DELETAR: Confere se a tarefa existe E se pertence ao usuário
const excluirTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const donoId = req.usuario.id;

    const tarefaDeletada = await Tarefa.findOneAndDelete({ _id: id, usuarioId: donoId });

    if (!tarefaDeletada) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada ou acesso negado' });
    }
    res.status(200).json({ mensagem: 'Tarefa excluída com sucesso' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao excluir tarefa', erro: erro.message });
  }
};

module.exports = { listarTarefas, criarTarefa, atualizarTarefa, excluirTarefa };