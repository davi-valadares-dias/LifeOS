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
      totais
    });

    res.status(201).json(novaRefeicao);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao registrar refeição', erro: erro.message });
  }
};

const listarRefeicoes = async (req, res) => {
  try {
    const refeicoes = await Refeicao.find().sort({ data: -1 }).populate('itens.alimentoId');
    res.status(200).json(refeicoes);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar refeições', erro: erro.message });
  }
};

module.exports = { listarAlimentos, criarAlimento, registrarRefeicao, listarRefeicoes };