const express = require('express');
const router = express.Router();
const { 
  listarLancamentos, 
  criarLancamento, 
  atualizarLancamento, 
  excluirLancamento 
} = require('../controllers/financeiroController');

// As rotas já estão protegidas pelo authMiddleware lá no server.js
router.get('/', listarLancamentos);
router.post('/', criarLancamento);
router.put('/:id', atualizarLancamento);
router.delete('/:id', excluirLancamento);

module.exports = router;