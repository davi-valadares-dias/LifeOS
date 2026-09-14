const express = require('express');
const router = express.Router();
const { 
  criarProjeto, 
  listarProjetos, 
  apagarProjeto 
} = require('../controllers/projetoController');

router.post('/', criarProjeto);
router.get('/', listarProjetos);
router.delete('/:id', apagarProjeto);

module.exports = router;