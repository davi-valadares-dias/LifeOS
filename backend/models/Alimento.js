const mongoose = require('mongoose');

const AlimentoSchema = new mongoose.Schema({
  nome: { type: String, required: true }, 
  categoria: { type: String, required: true },
  calorias: { type: Number, required: true }, // Valores com base em 100g
  proteinas: { type: Number, required: true },
  carboidratos: { type: Number, required: true },
  gorduras: { type: Number, required: true },
  acucares: { type: Number, default: 0 },
});

module.exports = mongoose.model('Alimento', AlimentoSchema);