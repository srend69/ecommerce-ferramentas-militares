// =========================================================
// routes/login.js
//   POST /login → autentica o cliente e devolve o token JWT
// =========================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { get } = require('../../database/db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const cliente = await get('SELECT * FROM clientes WHERE email = ?', [
      String(email).trim().toLowerCase(),
    ]);
    if (!cliente) {
      // mensagem genérica para não revelar se o e-mail existe
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const senhaCorreta = await bcrypt.compare(String(senha), cliente.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: cliente.id, nome: cliente.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email },
    });
  } catch (erro) {
    return next(erro);
  }
});

module.exports = router;
