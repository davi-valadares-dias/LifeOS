const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true // Ex: "Entregar trabalho de Python", "Criar logo do Work Match"
  },
  categoria: {
    type: String,
    required: true // Ex: "Faculdade", "Projetos", "Pessoal"
  },
  status: {
    type: String,
    enum: ['Pendente', 'Em Andamento', 'Concluída'],
    default: 'Pendente' // Toda tarefa nova nasce como Pendente
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Tarefa', TarefaSchema);