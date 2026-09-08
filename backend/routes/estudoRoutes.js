const express = require('express');
const router = express.Router();
const estudoController = require('../controllers/estudoController');

router.post('/', estudoController.criarDisciplina);
router.get('/', estudoController.listarDisciplinas);
router.put('/:id', estudoController.atualizarDisciplina);
router.delete('/:id', estudoController.apagarDisciplina);

module.exports = router;