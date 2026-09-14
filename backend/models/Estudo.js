const mongoose = require('mongoose');

const EstudoSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  nome: { 
    type: String, 
    required: true 
  },
  professor: { 
    type: String 
  },
  faltas: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['Cursando', 'Aprovado', 'Reprovado'], 
    default: 'Cursando' 
  },
  dataCriacao: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Estudo', EstudoSchema);