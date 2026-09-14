const express = require('express');
const router = express.Router();
const { 
  listarTarefas, 
  criarTarefa, 
  atualizarTarefa, 
  excluirTarefa 
} = require('../controllers/tarefaController');

// Rotas de Tarefas (já estão protegidas pelo authMiddleware no server.js)
router.get('/', listarTarefas);
router.post('/', criarTarefa);
router.put('/:id', atualizarTarefa);
router.delete('/:id', excluirTarefa);

module.exports = router;