// =========================================================
// migrate.js — Script de MIGRATION do banco de dados.
// Cria as tabelas "clientes" e "produtos" e, na primeira
// execução, popula o catálogo de produtos.
// Uso: npm run migrate
// =========================================================
require('dotenv').config();

const { run, get, db } = require('./db');
const { PRODUTOS } = require('./seed-data');

async function migrate() {
  console.log('⚙️  Executando migration...');

  await run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT    NOT NULL,
      email     TEXT    NOT NULL UNIQUE,
      senha     TEXT    NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabela "clientes" criada (ou já existente).');

  await run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT    NOT NULL,
      categoria TEXT    NOT NULL,
      preco     REAL    NOT NULL,
      estoque   INTEGER NOT NULL DEFAULT 0,
      descricao TEXT,
      imagem    TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabela "produtos" criada (ou já existente).');

  // Popula o catálogo apenas se a tabela estiver vazia (primeira vez).
  const { qtd } = await get('SELECT COUNT(*) AS qtd FROM produtos');
  if (qtd === 0) {
    const inserir = `INSERT INTO produtos
      (nome, categoria, preco, estoque, descricao, imagem)
      VALUES (?, ?, ?, ?, ?, ?)`;
    for (const p of PRODUTOS) {
      await run(inserir, [p.nome, p.categoria, p.preco, p.estoque, p.descricao, p.imagem]);
    }
    console.log(`✅ ${PRODUTOS.length} produtos inseridos no catálogo.`);
  } else {
    console.log(`ℹ️  A tabela "produtos" já possui ${qtd} registros (seed ignorado).`);
  }

  db.close();
  console.log('🎉 Migration concluída com sucesso!');
}

migrate().catch((erro) => {
  console.error('❌ Erro na migration:', erro);
  process.exit(1);
});
