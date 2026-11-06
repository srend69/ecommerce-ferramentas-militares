// =========================================================
// migrate.js — Script de MIGRATION do banco de dados.
// Executa, em ordem, todos os arquivos .sql da pasta
// "database/migrations" (001_tabela_clientes.sql,
// 002_tabela_produtos.sql, 003_indices.sql) e, na primeira
// execução, popula o catálogo de produtos.
// Uso (na raiz do projeto): npm run migrate
// =========================================================
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { run, exec, get, db } = require('./db');
const { PRODUTOS } = require('./seed-data');

async function migrate() {
  console.log('⚙️  Executando migrations...');

  // 1) Roda cada arquivo SQL da pasta migrations, em ordem numérica
  const pastaMigrations = path.join(__dirname, 'migrations');
  const arquivos = fs
    .readdirSync(pastaMigrations)
    .filter((arquivo) => arquivo.endsWith('.sql'))
    .sort();

  for (const arquivo of arquivos) {
    const sql = fs.readFileSync(path.join(pastaMigrations, arquivo), 'utf8');
    await exec(sql);
    console.log(`✅ Executada: ${arquivo}`);
  }

  // 2) Popula o catálogo apenas se a tabela estiver vazia (primeira vez)
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
