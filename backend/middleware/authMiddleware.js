const jwt = require('jsonwebtoken');

const protegerRota = (req, res, next) => {
  let token;

  // Verifica se o token foi enviado no cabeçalho da requisição
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai apenas o código do token (ex: "Bearer <token_gigante>")
      token = req.headers.authorization.split(' ')[1];

      // Descriptografa e valida o crachá
      const decodificado = jwt.verify(token, process.env.JWT_SECRET);
      
      // Salva o ID do usuário na requisição para podermos usar nas próximas funções
      req.usuario = decodificado.id;

      // Libera a catraca para o usuário passar
      next();
    } catch (erro) {
      return res.status(401).json({ mensagem: 'Não autorizado, token inválido.' });
    }
  }

  if (!token) {
    return res.status(401).json({ mensagem: 'Não autorizado, nenhum token fornecido.' });
  }
};

module.exports = protegerRota;