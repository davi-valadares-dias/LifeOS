const express = require('express');
const router = express.Router();
const { 
  criarDisciplina, 
  listarDisciplinas, 
  atualizarDisciplina, 
  apagarDisciplina 
} = require('../controllers/estudoController');

router.post('/', criarDisciplina);
router.get('/', listarDisciplinas);
router.put('/:id', atualizarDisciplina);
router.delete('/:id', apagarDisciplina);

module.exports = router;