const Financeiro = require('../models/Lancamento');

const adicionarLancamento = async (req, res) => {
  try {
    const dados = req.body;
    
    // Fallback: se o modelo exigir categoria e o front não enviar, não deixamos o servidor quebrar
    if (!dados.categoria) {
      dados.categoria = 'Geral';
    }

    const novoLancamento = new Financeiro(dados);
    const lancamentoSalvo = await novoLancamento.save();
    res.status(201).json(lancamentoSalvo);
  } catch (erro) {
    console.error('❌ Erro no adicionarLancamento:', erro.message); // Agora o erro aparece no terminal!
    res.status(500).json({ mensagem: 'Erro ao adicionar', erro: erro.message });
  }
};

const listarLancamentos = async (req, res) => {
  try {
    const lancamentos = await Financeiro.find().sort({ data: -1 });
    res.status(200).json(lancamentos);
  } catch (erro) {
    console.error('❌ Erro no listarLancamentos:', erro.message);
    res.status(500).json({ mensagem: 'Erro ao buscar', erro: erro.message });
  }
};

const atualizarLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    const lancamentoAtualizado = await Financeiro.findByIdAndUpdate(
      id, 
      req.body, 
      { returnDocument: 'after' } // Substitui o { new: true } para remover o Warning do Mongoose
    );
    res.status(200).json(lancamentoAtualizado);
  } catch (erro) {
    console.error('❌ Erro no atualizarLancamento:', erro.message);
    res.status(500).json({ mensagem: 'Erro ao atualizar', erro: erro.message });
  }
};

const apagarLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    await Financeiro.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Apagado com sucesso!' });
  } catch (erro) {
    console.error('❌ Erro no apagarLancamento:', erro.message);
    res.status(500).json({ mensagem: 'Erro ao apagar', erro: erro.message });
  }
};

module.exports = { 
  adicionarLancamento, 
  listarLancamentos, 
  atualizarLancamento, 
  apagarLancamento 
};