-- Migration 001 — Tabela de clientes (cadastro/login)
CREATE TABLE IF NOT EXISTS clientes (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT    NOT NULL,
  email     TEXT    NOT NULL UNIQUE,
  senha     TEXT    NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
