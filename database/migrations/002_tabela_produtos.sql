-- Migration 002 — Tabela de produtos (catálogo ferramentas de uso militar)
CREATE TABLE IF NOT EXISTS produtos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT    NOT NULL,
  categoria TEXT    NOT NULL,
  preco     REAL    NOT NULL,
  estoque   INTEGER NOT NULL DEFAULT 0,
  descricao TEXT,
  imagem    TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
