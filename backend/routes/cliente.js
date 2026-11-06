// =========================================================
// routes/cliente.js
//   POST /cliente         → cadastro de cliente
//   GET  /cliente/perfil  → dados do cliente logado
//                           (rota protegida por JWT)
// =========================================================
const express = require('express');
const bcrypt = require('bcryptjs');

const { get, run } = require('../../database/db');
const autenticar = require('../middleware/autenticar');

const router = express.Router();

// POST /cliente — cadastra um novo cliente (senha com hash bcrypt)
router.post('/', async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body || {};

    if (!nome || !String(nome).trim()) {
      return res.status(400).json({ erro: 'Informe o nome do cliente.' });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ erro: 'Informe o e-mail.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({ erro: 'E-mail inválido.' });
    }
    if (!senha || String(senha).length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const emailLimpo = String(email).trim().toLowerCase();
    const jaExiste = await get('SELECT id FROM clientes WHERE email = ?', [emailLimpo]);
    if (jaExiste) {
      return res.status(409).json({ erro: 'Já existe um cliente cadastrado com esse e-mail.' });
    }

    const senhaCriptografada = await bcrypt.hash(String(senha), 10);
    const resultado = await run(
      'INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)',
      [String(nome).trim(), emailLimpo, senhaCriptografada]
    );

    return res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso!',
      cliente: { id: resultado.lastID, nome: String(nome).trim(), email: emailLimpo },
    });
  } catch (erro) {
    return next(erro);
  }
});

// GET /cliente/perfil — exige autenticação (middleware JWT)
router.get('/perfil', autenticar, async (req, res, next) => {
  try {
    const cliente = await get(
      'SELECT id, nome, email, criado_em FROM clientes WHERE id = ?',
      [req.clienteId]
    );
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }
    return res.json({
      mensagem: 'Perfil carregado.',
      cliente,
    });
  } catch (erro) {
    return next(erro);
  }
});

module.exports = router;
