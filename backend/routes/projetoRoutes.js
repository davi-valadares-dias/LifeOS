const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');

router.post('/', projetoController.criarProjeto);
router.get('/', projetoController.listarProjetos);
router.delete('/:id', projetoController.apagarProjeto);

module.exports = router;