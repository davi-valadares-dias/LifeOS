const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true }, // Ex: "Prova de Estrutura de Dados"
  data: { type: Date, required: true },
  tipo: { type: String, enum: ['Prova', 'Compromisso', 'Lembrete'], default: 'Compromisso' },
  descricao: { type: String }
});

module.exports = mongoose.model('Evento', EventoSchema);