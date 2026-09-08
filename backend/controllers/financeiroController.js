// ATENÇÃO: Ajuste o final desta linha 1 se o seu arquivo Model tiver outro nome
const Financeiro = require('../models/Lancamento');

const adicionarLancamento = async (req, res) => {
  try {
    const novoLancamento = new Financeiro(req.body);
    const lancamentoSalvo = await novoLancamento.save();
    res.status(201).json(lancamentoSalvo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao adicionar', erro: erro.message });
  }
};

const listarLancamentos = async (req, res) => {
  try {
    const lancamentos = await Financeiro.find().sort({ data: -1 });
    res.status(200).json(lancamentos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar', erro: erro.message });
  }
};

const atualizarLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    const lancamentoAtualizado = await Financeiro.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(lancamentoAtualizado);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar', erro: erro.message });
  }
};

const apagarLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    await Financeiro.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Apagado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao apagar', erro: erro.message });
  }
};

// Se esse bloco não estiver aqui, o arquivo de rotas quebra!
module.exports = { 
  adicionarLancamento, 
  listarLancamentos, 
  atualizarLancamento, 
  apagarLancamento 
};