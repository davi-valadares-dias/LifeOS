const express = require('express');
const router = express.Router();
const { listarAlimentos, criarAlimento, registrarRefeicao, listarRefeicoes } = require('../controllers/nutricaoController');

// CORREÇÃO: Tiramos as chaves {}. O Node vai puxar a função inteira do arquivo.
const authMiddleware = require('../middleware/authMiddleware'); 

// Aplica a segurança em todas as rotas
router.use(authMiddleware); 

router.get('/alimentos', listarAlimentos);
router.post('/alimentos', criarAlimento);

router.get('/refeicoes', listarRefeicoes);
router.post('/refeicoes', registrarRefeicao);

module.exports = router;