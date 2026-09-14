const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
  // NOVA LINHA OBRIGATÓRIA: Etiqueta do dono da tarefa
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  titulo: { 
    type: String, 
    required: true 
  },
  categoria: { 
    type: String, 
    default: 'Geral' 
  },
  status: { 
    type: String, 
    enum: ['Pendente', 'Concluída'], 
    default: 'Pendente' 
  },
  dataCriacao: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Tarefa', TarefaSchema);