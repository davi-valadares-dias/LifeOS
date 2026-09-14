const mongoose = require('mongoose');

const ProjetoSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  nome: { type: String, required: true }, 
  descricao: { type: String, required: true },
  tecnologias: { type: String, required: true }, 
  linkGithub: { type: String }, 
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Projeto', ProjetoSchema);