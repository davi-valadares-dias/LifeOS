const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');

router.post('/', tarefaController.criarTarefa);
router.get('/', tarefaController.listarTarefas);

// Rota para atualizar o status (usamos PUT ou PATCH para atualizações)
router.put('/:id', tarefaController.atualizarStatus);

router.delete('/:id', tarefaController.apagarTarefa);

module.exports = router;