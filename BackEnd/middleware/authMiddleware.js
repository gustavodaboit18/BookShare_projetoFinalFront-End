const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function protect(req, res, next) {
  let token;

  // Verifica se o token está no header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pega o token do header
      token = req.headers.authorization.split(' ')[1];

      // Verifica o token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Adiciona o ID do usuário ao objeto req
      req.userId = decoded.id;

      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(401).json({ error: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Não autorizado, nenhum token' });
  }
}

module.exports = { protect };
