const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Garante que não existam dois usuários com o mesmo e-mail
  },
  senha: { 
    type: String, 
    required: true 
  },
  dataCriacao: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);