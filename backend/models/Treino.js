const mongoose = require('mongoose');

const TreinoSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  grupoMuscular: { 
    type: String, 
    required: true 
  },
  exerciciosFeitos: { 
    type: String, 
    required: true 
  },
  duracaoMinutos: { 
    type: Number, 
    required: true 
  },
  data: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Treino', TreinoSchema);