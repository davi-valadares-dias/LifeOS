const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para criar uma nova conta
const registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // 1. Verifica se o usuário já existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensagem: 'Este e-mail já está em uso.' });
    }

    // 2. Criptografa a senha (gera o "salt" e mistura com a senha)
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // 3. Salva o usuário no banco com a senha blindada
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada
    });

    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: erro.message });
  }
};

// Função para entrar no sistema
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verifica se o e-mail existe no banco
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    // 2. Compara a senha digitada com a senha criptografada do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    // 3. Gera o Token de Acesso (Crachá JWT)
    // OBS: Precisaremos colocar o JWT_SECRET no seu arquivo .env depois
    const token = jwt.sign(
      { id: usuario._id }, 
      process.env.JWT_SECRET || 'chave_super_secreta_padrao', 
      { expiresIn: '1d' } // O login dura 1 dia
    );

    // 4. Devolve o token e os dados do usuário para o Front-end
    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email }
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: erro.message });
  }
};

module.exports = { registrar, login };