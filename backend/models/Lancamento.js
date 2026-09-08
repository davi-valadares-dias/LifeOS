const mongoose = require('mongoose');

const LancamentoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['entrada', 'saida'] // Bloqueia qualquer coisa diferente dessas duas palavras
  },
  valor: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now // Se você não preencher a data no front-end, ele puxa o dia de hoje
  },
  categoria: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  formaPagamento: {
    type: String,
    default: 'não informada'
  }
}, { 
  timestamps: true // Cria automaticamente um histórico invisível de quando o dado foi criado e atualizado
});

module.exports = mongoose.model('Lancamento', LancamentoSchema);