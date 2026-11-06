# 🪖 MILGEAR — E-commerce de ferramentas de uso militar

Projeto avaliativo de **API + banco de dados + front-end** em um único repositório GitHub, organizado em **backend, frontend, database (com as migrations) e docs**:

- **`backend/`** — API Node.js + Express + **JWT**, que também entrega o site
- **`frontend/`** — site em HTML + CSS + JS puros, com **cadastro e login funcionando**
- **`database/`** — SQLite (o *database* visualizável no VS Code) com **migrations** e seeds — dados do catálogo integrados com a **RapidAPI** (opcional)
- **`docs/`** — documentação, arquitetura e exemplos de requisição

---

## ⚙️ Como rodar (a partir da raiz)

```bash
# 1) Instalar as dependências
npm install

# 2) Criar o arquivo .env — copie o conteúdo de dotenv-example.txt
#    (arquivos de exemplo; troque o JWT_SECRET em produção)

# 3) Aplicar as MIGRATIONS no banco + catálogo inicial
npm run migrate

# 4) (opcional) Recriar o catálogo usando a RapidAPI
npm run seed

# 5) Subir backend + frontend juntos
npm start          # ou: npm run dev (reinicia sozinho ao editar)
```

Depois abra **http://localhost:3000** — o backend entrega o frontend
(login/cadastro em `/`, catálogo em `/produtos.html`, perfil em `/perfil.html`).

> **Database do VS Code:** o arquivo do SQLite é `database/banco.db`
> (gerado pelo `npm run migrate`). Instale a extensão **SQLite**
> (alexcvzz) ou **SQLite Viewer**, clique com o botão direito no arquivo e
> escolha **Open Database** — o banco aparece na barra lateral.

---

## 📁 Estrutura do projeto

```
.
├── backend/                     # API (Express + JWT)
│   ├── server.js                # Servidor: API + entrega o frontend
│   ├── routes/
│   │   ├── cliente.js           # POST /cliente · GET /cliente/perfil
│   │   ├── login.js             # POST /login
│   │   └── produto.js           # GET /produto (filtros + paginação)
│   └── middleware/
│       └── autenticar.js        # Middleware JWT (Bearer token)
├── frontend/                    # SITE (HTML/CSS/JS puro)
│   ├── index.html               # Cadastro + login
│   ├── produtos.html            # Catálogo (filtros + paginação)
│   ├── perfil.html              # Perfil (rota protegida)
│   ├── css/style.css
│   └── js/ (api.js · layout.js · auth.js · produtos.js · perfil.js)
├── database/                    # BANCO DE DADOS
│   ├── db.js                    # Conexão SQLite usando o .env
│   ├── migrations/              # Migrations em SQL (numeradas)
│   │   ├── 001_tabela_clientes.sql
│   │   ├── 002_tabela_produtos.sql
│   │   └── 003_indices.sql
│   ├── migrate.js               # Script de migration (aplica os .sql)
│   ├── seed.js                  # Seed do catálogo (local ou RapidAPI)
│   └── seed-data.js             # Catálogo padrão + categorias
├── docs/
│   ├── rotas.http               # Exemplos de requisição (REST Client)
│   └── arquitetura.md           # Arquitetura e fluxos
├── README.md
├── package.json
└── dotenv-example.txt           # Exemplo do .env (pedido no enunciado)
```

---

## 🔐 Rotas do backend

| Método | Rota              | Descrição                        | Autenticação |
|--------|-------------------|----------------------------------|--------------|
| POST   | `/cliente`        | Cadastro do cliente              | não          |
| POST   | `/login`          | Autenticação e devolve o JWT     | não          |
| GET    | `/cliente/perfil` | Dados do cliente logado          | **sim (JWT)**|
| GET    | `/produto`        | Catálogo com filtros + paginação | não          |
| GET    | `/produto/categorias` | Categorias do catálogo       | não          |
| GET    | `/produto/:id`    | Detalhe de um produto            | não          |

### Cadastro e login (JSON no corpo)

```bash
curl -X POST http://localhost:3000/cliente \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Martins","email":"ana@teste.com","senha":"123456"}'

curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@teste.com","senha":"123456"}'
# → { "token": "eyJhbGciOi...", "cliente": { "id":1, "nome":"Ana Martins", ... } }
```

### Rota protegida (JWT)

```bash
curl http://localhost:3000/cliente/perfil \
  -H "Authorization: Bearer $TOKEN"
```

O token é assinado com a variável `JWT_SECRET` do `.env` e dura 8 horas.
No frontend, o **nome** e o **token** do cliente logado ficam salvos no
**LocalStorage** (chaves `nome` e `token`) — o fetch injeta o cabeçalho
`Authorization: Bearer <token>` automaticamente.

---

## 🔍 Filtros da rota `/produto`

| Filtro                | Exemplo                          | O que faz                        |
|-----------------------|----------------------------------|----------------------------------|
| Busca por nome        | `GET /produto?nome=lanterna`     | LIKE %nome% (feita em sala)      |
| Ordenação por preço   | `GET /produto?ordem=menor`       | `menor` = preço ASC (*preco_asc*)|
|                       | `GET /produto?ordem=maior`       | `maior` = preço DESC (*preco_desc*) |
| Filtro por categoria  | `GET /produto?categoria=ferramenta` | categorias: `ferramenta`, `otica`, `iluminacao`, `comunicacao`, `sobrevivencia`, `mochila`, `cordame`, `socorros` |
| Preço mínimo e máximo | `GET /produto?preco_min=200&preco_max=700` | faixa de preço |
| **Paginação**         | `GET /produto?pagina=2`          | **limite fixo de 10 por página**: pagina=1 → 1º ao 10º · pagina=2 → 11º ao 20º · pagina=3 → 21º ao 30º ... |

Os filtros podem ser combinados, por exemplo:

```bash
curl "http://localhost:3000/produto?ordem=maior&preco_min=200&preco_max=700&pagina=1"
```

Resposta exemplo:

```json
{
  "total": 12,
  "pagina": 1,
  "limite": 10,
  "totalPaginas": 2,
  "produtos": [ { "id": 2, "nome": "Pá de Trincheira Dobrável Tactical",
                  "categoria": "ferramenta", "preco": 249.9,
                  "estoque": 18, "descricao": "...", "imagem": "⛏️" } ]
}
```

---

## 🗃️ Banco de dados e migrations

- `database/db.js` — **conexão** que lê as variáveis do `.env` (`DB_FILE` = arquivo do SQLite, `PORT`, `JWT_SECRET`...).
- `database/migrations/` — migrations **em SQL**, aplicadas em ordem por `database/migrate.js` (`npm run migrate`): tabelas `clientes` e `produtos` + índices para os filtros.
- Seeds: `npm run seed` recria o catálogo.

## 🌐 RapidAPI (opcional no seed)

O `database/seed.js` usa o catálogo local por padrão. Com uma chave da
RapidAPI no `.env` (`RAPIDAPI_KEY`, `RAPIDAPI_HOST`, `RAPIDAPI_BUSCA`), ele
busca produtos reais (ex.: endpoint *Real-Time Amazon Data*) e grava no
SQLite. Sem chave (ou em caso de falha), cai no catálogo local — o projeto
sempre funciona offline.

## 🚀 Deploy (resumo)

- **Backend (Render/Railway/Fly):** publique o repositório, defina as
  variáveis do `.env` no painel (`JWT_SECRET`, `PORT`, `DB_FILE`) e execute
  `npm run migrate` antes de iniciar.
- **Frontend junto com a API:** ajuste apenas `API_BASE` em
  `frontend/js/api.js` (padrão `""` funciona quando o Express entrega o
  site; use a URL pública da API se publicar o frontend em outro lugar,
  ex. GitHub Pages).
