const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');

router.post('/', treinoController.registrarTreino);
router.get('/', treinoController.listarTreinos);

// --- NOVA ROTA DE EDIÇÃO ---
router.put('/:id', treinoController.atualizarTreino);

router.delete('/:id', treinoController.apagarTreino);

module.exports = router;