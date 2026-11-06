// =========================================================
// db.js — Conexão com o banco de dados SQLite.
// A conexão usa VARIÁVEIS DE AMBIENTE configuradas no .env
// (veja o exemplo em dotenv-example.txt).
// =========================================================
require('dotenv').config();

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// DB_FILE é definido no .env (ex.: DB_FILE=banco.db)
const arquivoBanco = process.env.DB_FILE || 'banco.db';

const db = new sqlite3.Database(path.resolve(__dirname, arquivoBanco), (erro) => {
  if (erro) {
    console.error('❌ Não foi possível conectar ao banco de dados:', erro.message);
  } else {
    console.log(`💾 Conectado ao banco de dados SQLite: ${arquivoBanco}`);
  }
});

// Helpers que transformam os callbacks do sqlite3 em Promises,
// permitindo usar async/await nas rotas.
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (erro) {
      if (erro) reject(erro);
      else resolve(this); // this.lastID e this.changes ficam disponíveis
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (erro, linha) => (erro ? reject(erro) : resolve(linha)));
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (erro, linhas) => (erro ? reject(erro) : resolve(linhas)));
  });

module.exports = { db, run, get, all };
