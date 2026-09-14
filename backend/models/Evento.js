const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  titulo: { type: String, required: true }, 
  data: { type: Date, required: true },
  tipo: { type: String, enum: ['Prova', 'Compromisso', 'Lembrete'], default: 'Compromisso' },
  descricao: { type: String }
});

module.exports = mongoose.model('Evento', EventoSchema);