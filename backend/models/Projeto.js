const mongoose = require('mongoose');

const ProjetoSchema = new mongoose.Schema({
  nome: { type: String, required: true }, // Ex: "Jogo da Memória Digital"
  descricao: { type: String, required: true },
  tecnologias: { type: String, required: true }, // Ex: "React, CSS, Node"
  linkGithub: { type: String }, 
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Projeto', ProjetoSchema);