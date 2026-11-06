// =========================================================
// routes/produto.js — Rota /produto do catálogo.
//
// Filtros suportados (via query string):
//   ?nome=lanterna              → filtro de busca por nome
//   ?ordem=menor | ordem=maior  → ordenação por preço
//   ?categoria=ferramenta       → filtro por categoria
//   ?preco_min=200&preco_max=700 → filtro por faixa de preço
//   ?pagina=2                   → paginação (offset)
//
// A consulta tem LIMITE FIXO de 10 produtos por página:
//   pagina=1 → produtos 1º ao 10º
//   pagina=2 → produtos 11º ao 20º
//   pagina=3 → produtos 21º ao 30º ...
// =========================================================
const express = require('express');

const { get, all } = require('../../database/db');
const { CATEGORIAS } = require('../../database/seed-data');

const router = express.Router();

// Quantidade fixa escolhida para limitar cada consulta (o
// enunciado permite 10, 12, 16 etc.).
const LIMITE_POR_PAGINA = 10;

// Minúsculas, sem acentos e sem espaços nas pontas.
function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

// GET /produto — lista com filtros, ordenação e paginação
router.get('/', async (req, res, next) => {
  try {
    const filtros = [];
    const params = [];

    // 1) Filtro de busca por nome
    const nome = normalizar(req.query.nome);
    if (nome) {
      filtros.push('LOWER(nome) LIKE ?');
      params.push(`%${nome}%`);
    }

    // 2) Filtro por categoria (compara sem acento, ignorando - e _)
    const categoria = normalizar(req.query.categoria);
    if (categoria) {
      filtros.push(
        "LOWER(REPLACE(REPLACE(categoria, '-', ' '), '_', ' ')) = ?"
      );
      params.push(categoria.replace(/[-_]+/g, ' ').trim());
    }

    // 3) Filtro por preço mínimo e máximo
    const precoMin = parseFloat(req.query.preco_min ?? req.query.precoMin);
    const precoMax = parseFloat(req.query.preco_max ?? req.query.precoMax);
    if (!Number.isNaN(precoMin)) {
      filtros.push('preco >= ?');
      params.push(precoMin);
    }
    if (!Number.isNaN(precoMax)) {
      filtros.push('preco <= ?');
      params.push(precoMax);
    }

    const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

    // 4) Ordenação por menor ou maior preço
    const ordem = normalizar(req.query.ordem || req.query.ordenar);
    const ordenacoesPossiveis = {
      menor: 'preco ASC',
      preco_asc: 'preco ASC',
      asc: 'preco ASC',
      maior: 'preco DESC',
      preco_desc: 'preco DESC',
      desc: 'preco DESC',
    };
    const orderBy = ordenacoesPossiveis[ordem] || 'id ASC';

    // 5) Paginação — OFFSET muda de acordo com a página
    let pagina = parseInt(req.query.pagina, 10);
    if (!Number.isInteger(pagina) || pagina < 1) pagina = 1;
    const offset = (pagina - 1) * LIMITE_POR_PAGINA;

    // Total de produtos que atendem aos filtros (para a paginação do site)
    const { total } = await get(`SELECT COUNT(*) AS total FROM produtos ${where}`, params);

    // Produtos da página atual (LIMIT fixo + OFFSET)
    const produtos = await all(
      `SELECT * FROM produtos ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, LIMITE_POR_PAGINA, offset]
    );

    return res.json({
      total,
      pagina,
      limite: LIMITE_POR_PAGINA,
      totalPaginas: Math.max(1, Math.ceil(total / LIMITE_POR_PAGINA)),
      categoriasDisponiveis: Object.keys(CATEGORIAS),
      produtos,
    });
  } catch (erro) {
    return next(erro);
  }
});

// GET /produto/categorias — categorias usadas no catálogo
router.get('/categorias', async (req, res, next) => {
  try {
    const linhas = await all(
      'SELECT categoria, COUNT(*) AS quantidade FROM produtos GROUP BY categoria ORDER BY categoria'
    );
    const categorias = linhas.map((l) => ({
      slug: l.categoria,
      label: CATEGORIAS[l.categoria]?.label || l.categoria,
      emoji: CATEGORIAS[l.categoria]?.emoji || '📦',
      quantidade: l.quantidade,
    }));
    return res.json({ categorias });
  } catch (erro) {
    return next(erro);
  }
});

// GET /produto/:id
router.get('/:id', async (req, res, next) => {
  try {
    const produto = await get('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
    return res.json(produto);
  } catch (erro) {
    return next(erro);
  }
});

module.exports = router;
