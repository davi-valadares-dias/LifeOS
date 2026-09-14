const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Pega o token do cabeçalho da requisição
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // 2. Tenta abrir o "crachá" com a sua senha secreta
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. A MÁGICA: Pendura os dados do usuário na requisição para os Controllers usarem!
    // OBS: O decodificado costuma ter o formato { id: 'numero_do_id_aqui' }
    req.usuario = decodificado; 
    
    // 4. Libera a passagem para a rota
    next();
  } catch (erro) {
    res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;