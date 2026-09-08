const mongoose = require('mongoose');

const EstudoSchema = new mongoose.Schema({
  disciplina: { type: String, required: true }, // Ex: "Estrutura de Dados"
  professor: { type: String },
  faltas: { type: Number, default: 0 },
  maxFaltas: { type: Number, required: true }, // Limite para não reprovar
  status: { type: String, enum: ['Cursando', 'Aprovado', 'Reprovado'], default: 'Cursando' }
});

module.exports = mongoose.model('Estudo', EstudoSchema);