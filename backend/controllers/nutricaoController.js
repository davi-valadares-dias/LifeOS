const Alimento = require('../models/Alimento');
const Refeicao = require('../models/Refeicao');

// ALIMENTOS (BASE DE DADOS)
const listarAlimentos = async (req, res) => {
  try {
    const alimentos = await Alimento.find().sort({ nome: 1 });
    res.status(200).json(alimentos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar alimentos', erro: erro.message });
  }
};

const criarAlimento = async (req, res) => {
  try {
    const novoAlimento = await Alimento.create(req.body);
    res.status(201).json(novoAlimento);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar alimento', erro: erro.message });
  }
};

// REFEIÇÕES (DIÁRIO)
const registrarRefeicao = async (req, res) => {
  try {
    const { tipo, data, itens } = req.body;
    const donoId = req.usuario.id;
    let totais = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, acucares: 0 };
    const itensProcessados = [];

    // Calcula os macros de acordo com o peso de cada alimento
    for (let item of itens) {
      const alimentoDB = await Alimento.findById(item.alimentoId);
      const proporcao = item.quantidadeGramas / 100;

      totais.calorias += alimentoDB.calorias * proporcao;
      totais.proteinas += alimentoDB.proteinas * proporcao;
      totais.carboidratos += alimentoDB.carboidratos * proporcao;
      totais.gorduras += alimentoDB.gorduras * proporcao;
      totais.acucares += alimentoDB.acucares * proporcao;

      itensProcessados.push({
        alimentoId: alimentoDB._id,
        nomeSnapshot: alimentoDB.nome, // Trava o nome para o histórico não quebrar se o alimento mudar
        quantidadeGramas: item.quantidadeGramas
      });
    }

    const novaRefeicao = await Refeicao.create({
      tipo,
      data: data || new Date(),
      itens: itensProcessados,
      totais,
      usuarioId: donoId
    });

    res.status(201).json(novaRefeicao);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao registrar refeição', erro: erro.message });
  }
};

const listarRefeicoes = async (req, res) => {
  try {
    const donoId = req.usuario.id; // <-- Pega o ID de quem tá logado
    const refeicoes = await Refeicao.find({ usuarioId: donoId }).sort({ data: -1 }); // <-- Filtra pelo dono
    res.status(200).json(refeicoes);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro', erro: erro.message });
  }
};

// Função para DELETAR uma refeição (Com proteção multi-usuário)
const excluirRefeicao = async (req, res) => {
  try {
    const { id } = req.params;
    const donoId = req.usuario.id; // Garante que só exclui se for o dono

    const refeicaoDeletada = await Refeicao.findOneAndDelete({ _id: id, usuarioId: donoId });

    if (!refeicaoDeletada) {
      return res.status(404).json({ mensagem: 'Refeição não encontrada ou acesso negado' });
    }
    
    res.status(200).json({ mensagem: 'Refeição excluída com sucesso' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao excluir refeição', erro: erro.message });
  }
};

module.exports = { listarAlimentos, criarAlimento, registrarRefeicao, listarRefeicoes, excluirRefeicao };