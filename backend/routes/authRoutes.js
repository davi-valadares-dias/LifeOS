const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/authController');

// Rota para cadastrar um novo usuário (POST /api/auth/registrar)
router.post('/registrar', registrar);

// Rota para fazer login (POST /api/auth/login)
router.post('/login', login);

module.exports = router;