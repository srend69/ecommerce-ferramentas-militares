-- Migration 003 — Índices para acelerar os filtros da rota /produto
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos (categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_preco     ON produtos (preco);
