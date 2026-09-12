const mongoose = require('mongoose');

const RefeicaoSchema = new mongoose.Schema({
  tipo: { type: String, required: true }, // ex: Café da manhã, Almoço
  data: { type: Date, default: Date.now },
  itens: [{
    alimentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alimento', required: true },
    quantidadeGramas: { type: Number, required: true },
    nomeSnapshot: String, // Salva o nome do alimento no momento do registro
  }],
  totais: {
    calorias: { type: Number, default: 0 },
    proteinas: { type: Number, default: 0 },
    carboidratos: { type: Number, default: 0 },
    gorduras: { type: Number, default: 0 },
    acucares: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Refeicao', RefeicaoSchema);