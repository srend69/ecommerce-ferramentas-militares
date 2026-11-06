// =========================================================
// middleware/autenticar.js — Middleware de autenticação JWT.
// Verifica o cabeçalho "Authorization: Bearer <token>" e usa
// a variável de ambiente JWT_SECRET (definida no .env) para
// validar o token. Bloqueia a requisição com 401 se inválida.
// =========================================================
const jwt = require('jsonwebtoken');

module.exports = function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Envie o token no cabeçalho Authorization: Bearer <token>.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.clienteId = payload.id; // disponível para as rotas protegidas
    req.clienteNome = payload.nome;
    return next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado. Faça login novamente.' });
  }
};
