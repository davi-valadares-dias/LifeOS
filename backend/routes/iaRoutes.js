const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController');

router.post('/', iaController.consultarIA);
router.get('/historico', iaController.listarHistorico); // <-- Nova rota
router.delete('/limpar', iaController.limparHistorico); // <-- Nova rota

module.exports = router;