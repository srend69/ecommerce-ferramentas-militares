/* =========================================================
   api.js — Configuração e acesso à API do MILGEAR.
   Também guarda o estado de login no LocalStorage
   (nome + token do cliente logado), como pedido no enunciado.
   ========================================================= */

/* Rodando pelo próprio servidor, deixe API_BASE = "" e abra o
   site em http://localhost:3000 (o backend entrega o frontend).
   Se publicar o site em outro lugar (GitHub Pages, Vercel etc.),
   troque pela URL pública da API, ex.: 'https://sua-api.onrender.com'. */
const API_BASE = location.protocol === 'file:' ? 'http://localhost:3000' : '';

if (location.protocol === 'file:') {
  console.warn(
    'Site aberto por file://. O ideal é rodar a API (npm start) e acessar http://localhost:3000.'
  );
}

/** Chaves usadas no LocalStorage */
const CHAVE_TOKEN = 'token';
const CHAVE_NOME = 'nome';

/* ---------- estado de login (LocalStorage) ---------- */
const auth = {
  logado() {
    return Boolean(localStorage.getItem(CHAVE_TOKEN));
  },
  nome() {
    return localStorage.getItem(CHAVE_NOME) || 'Cliente';
  },
  /** Salva o nome e o token do cliente logado no LocalStorage. */
  entrar(nome, token) {
    localStorage.setItem(CHAVE_NOME, nome);
    localStorage.setItem(CHAVE_TOKEN, token);
  },
  /** Limpa o login e volta para a página inicial. */
  sair() {
    localStorage.removeItem(CHAVE_NOME);
    localStorage.removeItem(CHAVE_TOKEN);
    location.href = 'index.html';
  },
};

/* ---------- fetch com a API ---------- */
/** Caminho + opções → resposta JSON com token no cabeçalho. */
async function apiFetch(caminho, opcoes = {}) {
  const cabecalhos = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  const token = localStorage.getItem(CHAVE_TOKEN);
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${API_BASE}${caminho}`, { ...opcoes, headers: cabecalhos });
  let dados = {};
  try {
    dados = await resposta.json();
  } catch (e) {
    /* resposta sem corpo JSON */
  }
  return { ok: resposta.ok, status: resposta.status, dados };
}

/* ---------- utilidades ---------- */
function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* Aparência das categorias (slug → label). Sincronizado com seed-data.js da API. */
const CATEGORIAS = {
  ferramenta:    { label: 'Ferramentas',            emoji: '🛠️' },
  otica:         { label: 'Óptica e navegação',     emoji: '🔭' },
  iluminacao:    { label: 'Iluminação',              emoji: '🔦' },
  comunicacao:   { label: 'Comunicação',             emoji: '📻' },
  sobrevivencia: { label: 'Sobrevivência',           emoji: '🪓' },
  mochila:       { label: 'Mochilas e equipamento',  emoji: '🎒' },
  cordame:       { label: 'Cordame',                 emoji: '🪢' },
  socorros:      { label: 'Primeiros socorros',      emoji: '🩹' },
};

function infoCategoria(slug) {
  return CATEGORIAS[slug] || { label: slug, emoji: '📦' };
}
