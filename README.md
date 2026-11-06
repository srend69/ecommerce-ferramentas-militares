# 🪖 MILGEAR — E-commerce de ferramentas de uso militar

Projeto avaliativo de **API + banco de dados + front-end** em um único repositório:

- **API (raiz do repositório):** Node.js + Express + **SQLite** (extensão do VS Code) + **JWT**
- **Site (pasta `site/`):** HTML + CSS + JavaScript puros, com **cadastro e login funcionando**
- Dados dos produtos: catálogo padrão do projeto + integração opcional com a **RapidAPI** no seed

---

## ⚙️ Como rodar

```bash
# 1) Instalar as dependências
npm install

# 2) Criar o arquivo .env — copie o conteúdo de dotenv-example.txt
#    (está com valores de exemplo; troque o JWT_SECRET em produção)

# 3) Criar as tabelas do banco (migration) + catálogo inicial
npm run migrate

# 4) (opcional) Recriar o catálogo usando a RapidAPI
npm run seed

# 5) Subir a API e o site juntos
npm start          # ou: npm run dev (reinicia sozinho ao editar)
```

Depois abra **http://localhost:3000** — o próprio servidor entrega o site
(login/cadastro em `/`, catálogo em `/produtos.html`, perfil em `/perfil.html`).

> Banco visualizado no *database* do VS Code: instale a extensão **SQLite**
> (alexcvzz) ou **SQLite Viewer**, clique com o botão direito no arquivo
> `banco.db` e depois em **Open Database**, aparecendo no painel lateral.

---

## 📁 Estrutura do projeto

```
.
├── server.js              # Servidor Express (API + site)
├── db.js                  # Conexão SQLite usando variáveis do .env
├── migrate.js             # Script de migration (cria as tabelas)
├── seed.js                # Seed do catálogo (local ou RapidAPI)
├── seed-data.js           # Catálogo padrão + categorias
├── routes/
│   ├── cliente.js         # POST /cliente  ·  GET /cliente/perfil
│   ├── login.js           # POST /login
│   └── produto.js         # GET /produto (filtros + paginação)
├── middleware/
│   └── autenticar.js      # Middleware JWT (Bearer token)
├── dotenv-example.txt     # Exemplo do .env (pedido no enunciado)
├── rotas.http             # Exemplos de requisição p/ VS Code REST Client
└── site/                  # FRONT-END completo
    ├── index.html         # Cadastro + login
    ├── produtos.html      # Catálogo (filtros + paginação)
    ├── perfil.html        # Perfil (rota protegida)
    ├── css/style.css
    └── js/ (api.js · layout.js · auth.js · produtos.js · perfil.js)
```

---

## 🔐 Rotas da API

| Método | Rota             | Descrição                        | Autenticação |
|--------|------------------|----------------------------------|--------------|
| POST   | `/cliente`       | Cadastro do cliente              | não          |
| POST   | `/login`         | Autenticação e devolve o JWT     | não          |
| GET    | `/cliente/perfil`| Dados do cliente logado          | **sim (JWT)**|
| GET    | `/produto`       | Catálogo com filtros + paginação | não          |
| GET    | `/produto/categorias` | Categorias do catálogo      | não          |
| GET    | `/produto/:id`   | Detalhe de um produto            | não          |

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

O token JWT é assinado com a variável `JWT_SECRET` do `.env` e dura 8 horas.
No site, o **nome** e o **token** do cliente logado ficam salvos no
**LocalStorage** (chaves `nome` e `token`) — o fetch da API injeta o
cabeçalho `Authorization: Bearer <token>` automaticamente.

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

## 🌐 RapidAPI (opcional no seed)

O `seed.js` usa o catálogo local por padrão. Se você colocar uma chave da
RapidAPI no `.env` (`RAPIDAPI_KEY`, `RAPIDAPI_HOST`, `RAPIDAPI_BUSCA`), ele
busca produtos reais (ex.: endpoint *Real-Time Amazon Data*) e grava no
SQLite. Sem chave (ou em caso de falha), cai no catálogo local — o projeto
sempre funciona offline.

## 🚀 Deploy (resumo)

- **API (Render/Railway/Fly):** publique o repositório, defina as variáveis
  do `.env` no painel (`JWT_SECRET`, `PORT`, `DB_FILE`) e execute
  `npm run migrate` antes de iniciar.
- **Site junto com a API:** ajuste apenas `API_BASE` em `site/js/api.js`
  (padrão `""` funciona quando o Express entrega o site; use a URL pública
  da API se publicar o site em outro lugar, ex. GitHub Pages).
