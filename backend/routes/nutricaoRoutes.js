const express = require('express');
const router = express.Router();
const { 
  listarAlimentos, 
  criarAlimento, 
  registrarRefeicao, 
  listarRefeicoes, 
  excluirRefeicao // <-- Nova função aqui
} = require('../controllers/nutricaoController');

router.get('/alimentos', listarAlimentos);
router.post('/alimentos', criarAlimento);

router.get('/refeicoes', listarRefeicoes);
router.post('/refeicoes', registrarRefeicao);
router.delete('/refeicoes/:id', excluirRefeicao); // <-- Nova rota aqui

module.exports = router;