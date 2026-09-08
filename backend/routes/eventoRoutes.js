const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

router.post('/', eventoController.criarEvento);
router.get('/', eventoController.listarEventos);
router.delete('/:id', eventoController.apagarEvento);

module.exports = router;