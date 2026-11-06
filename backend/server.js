// =========================================================
// server.js — Servidor do BACKEND (API) que também entrega
// o FRONTEND (pasta ../frontend). Repositório único.
//   API:     /cliente  /login  /produto
//   Site:    http://localhost:PORTA (páginas do frontend/)
// Uso: npm start   (ou npm run dev para recarregar automaticamente)
// =========================================================
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const clienteRoutes = require('./routes/cliente');
const loginRoutes = require('./routes/login');
const produtoRoutes = require('./routes/produto');

// Garante que a conexão (database/db.js) abra desde o boot.
require('../database/db');

// Segredo do JWT deve estar no .env da raiz (veja dotenv-example.txt).
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET não definida no .env — usando um segredo padrão (troque no .env!).');
  process.env.JWT_SECRET = 'segredo-padrao-troque-em-env';
}

const app = express();

app.use(cors()); // permite que o site acesse a API
app.use(express.json()); // habilita JSON no corpo das requisições

// Servir o FRONTEND (pasta ../frontend) junto com a API.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rotas da API
app.use('/cliente', clienteRoutes);
app.use('/login', loginRoutes);
app.use('/produto', produtoRoutes);

// Rota não encontrada
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

// Tratamento central de erros
app.use((erro, req, res, next) => {
  console.error('❌ Erro:', erro);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log('🪖  MILGEAR — API de ferramentas de uso militar');
  console.log(`🚀 API rodando em    http://localhost:${PORTA}/produto`);
  console.log(`🛒 Site disponível em http://localhost:${PORTA}/`);
});
