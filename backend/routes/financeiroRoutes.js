const express = require('express');
const router = express.Router();
const financeiroController = require('../controllers/financeiroController');

router.post('/', financeiroController.adicionarLancamento);
router.get('/', financeiroController.listarLancamentos);
router.put('/:id', financeiroController.atualizarLancamento);
router.delete('/:id', financeiroController.apagarLancamento);

module.exports = router;