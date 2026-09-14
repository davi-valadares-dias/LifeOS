const express = require('express');
const router = express.Router();
const { 
  criarEvento, 
  listarEventos, 
  apagarEvento 
} = require('../controllers/eventoController');

router.post('/', criarEvento);
router.get('/', listarEventos);
router.delete('/:id', apagarEvento);

module.exports = router;