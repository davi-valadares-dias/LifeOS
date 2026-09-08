const mongoose = require('mongoose');

const TreinoSchema = new mongoose.Schema({
  grupoMuscular: {
    type: String,
    required: true // Ex: "Costas e Bíceps"
  },
  exerciciosFeitos: {
    type: String, 
    required: true // Ex: "Puxada 60kg, Remada 30kg, Rosca 15kg"
  },
  duracaoMinutos: {
    type: Number,
    required: true // Ex: 60
  },
  data: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Treino', TreinoSchema);