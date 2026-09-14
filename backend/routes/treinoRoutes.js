const express = require('express');
const router = express.Router();
const { 
  listarTreinos, 
  criarTreino, 
  atualizarTreino, 
  excluirTreino 
} = require('../controllers/treinoController');

router.get('/', listarTreinos);
router.post('/', criarTreino);
router.put('/:id', atualizarTreino);
router.delete('/:id', excluirTreino);

module.exports = router;