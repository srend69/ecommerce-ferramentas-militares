// =========================================================
// seed.js — Popula (recria) o catálogo de produtos.
// Rodar depois de "npm run migrate".
// Uso: npm run seed
//
// Por padrão usa o catálogo local (seed-data.js). Se as
// variáveis RAPIDAPI_* estiverem configuradas no .env, busca
// os produtos reais na RapidAPI antes de gravar no banco.
// =========================================================
require('dotenv').config();

const { run, db } = require('./db');
const { PRODUTOS } = require('./seed-data');

/** Busca produtos na RapidAPI (opcional, exige chave no .env). */
async function buscarProdutosRapidAPI() {
  const chave = process.env.RAPIDAPI_KEY;
  if (!chave) {
    console.log('ℹ️  RAPIDAPI_KEY não configurada no .env — usando o catálogo local (seed-data.js).');
    return null;
  }

  const host = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';
  const busca = process.env.RAPIDAPI_BUSCA || 'military tools';
  console.log(`📡 Buscando produtos na RapidAPI (host: ${host})...`);

  const url = `https://${host}/search?query=${encodeURIComponent(busca)}&country=BR&language=pt-BR`;
  const resposta = await fetch(url, {
    headers: {
      'x-rapidapi-key': chave,
      'x-rapidapi-host': host,
    },
  });
  if (!resposta.ok) throw new Error(`RapidAPI respondeu HTTP ${resposta.status}`);

  const dados = await resposta.json();
  const lista = Array.isArray(dados?.data?.products) ? dados.data.products : [];

  const produtos = lista
    .slice(0, 30)
    .map((p) => ({
      nome: String(p.product_title || 'Produto sem título').slice(0, 120),
      categoria: 'ferramenta',
      preco:
        parseFloat(String(p.product_price || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0,
      estoque: Math.floor(Math.random() * 50) + 5,
      descricao: `${p.product_title || 'Produto'} — item obtido pela RapidAPI (${host}).`,
      imagem: p.product_photo || '',
    }))
    .filter((p) => p.preco > 0);

  if (produtos.length === 0) throw new Error('A RapidAPI não retornou produtos utilizáveis.');
  console.log(`✅ ${produtos.length} produtos recebidos da RapidAPI.`);
  return produtos;
}

async function seed() {
  let produtos = null;
  try {
    produtos = await buscarProdutosRapidAPI();
  } catch (erro) {
    console.warn(`⚠️  Falha na RapidAPI (${erro.message}) — usando o catálogo local.`);
  }
  if (!produtos) produtos = PRODUTOS;

  await run('DELETE FROM produtos');
  const inserir = `INSERT INTO produtos
    (nome, categoria, preco, estoque, descricao, imagem)
    VALUES (?, ?, ?, ?, ?, ?)`;
  for (const p of produtos) {
    await run(inserir, [p.nome, p.categoria, p.preco, p.estoque, p.descricao, p.imagem]);
  }

  console.log(`✅ ${produtos.length} produtos gravados no banco de dados.`);
  db.close();
}

seed().catch((erro) => {
  console.error('❌ Erro no seed:', erro);
  process.exit(1);
});
