const mongoose = require('mongoose');

const MensagemIASchema = new mongoose.Schema({
  papel: { type: String, enum: ['user', 'model'], required: true }, // 'user' é você, 'model' é a IA
  texto: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MensagemIA', MensagemIASchema);