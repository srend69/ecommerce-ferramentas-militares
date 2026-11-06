# Arquitetura do projeto — MILGEAR 🪖

E-commerce de ferramentas de uso militar em **um único repositório GitHub**, organizado em camadas:

```
frontend  ⇄  backend  ⇄  database
```

| Pasta | Papel |
|---|---|
| `backend/`     | API Node.js + Express (rotas `/cliente`, `/login`, `/produto`), middleware JWT e o servidor que também entrega o frontend |
| `frontend/`    | Site em HTML/CSS/JS puro: cadastro + login (LocalStorage com nome e token), catálogo com filtros e perfil protegido |
| `database/`    | Conexão SQLite (`db.js`, lê o `.env` da raiz), migrations em `migrations/*.sql` executadas por `migrate.js` e seeds (`seed.js` / `seed-data.js` com opção RapidAPI) |
| `docs/`        | Documentação: exemplos de requisição (`rotas.http`) e este documento |
| raiz           | `package.json` (scripts), `dotenv-example.txt`, `README.md` |

## Fluxo de uma requisição do catálogo

1. O navegador abre `frontend/produtos.html`.
2. O JS do frontend faz `GET /produto?...filtros` (mesma origem, pois o Express serve o frontend).
3. `backend/routes/produto.js` monta o SQL com filtros + `LIMIT 10 OFFSET` e consulta o SQLite via `database/db.js`.
4. A resposta JSON (`produtos`, `total`, `pagina`, `totalPaginas`) renderiza os cartões e a paginação.

## Fluxo de autenticação (JWT)

1. `POST /cliente` → `bcrypt` gera o hash da senha e grava o cliente no SQLite.
2. `POST /login` → valida e-mail/senha e devolve um **token JWT** assinado com `JWT_SECRET` (duração 8 h).
3. O site guarda **nome + token no LocalStorage** e envia o cabeçalho `Authorization: Bearer <token>` nas chamadas seguintes.
4. `GET /cliente/perfil` usa o middleware `backend/middleware/autenticar.js` — só responde 200 com token válido.

## Migrações

- Arquivos SQL numéricos em `database/migrations/` (001 tabelas de clientes/produtos, 002..., 003 índices).
- `npm run migrate` aplica as migrations em ordem e faz o seed inicial do catálogo.
- O arquivo SQLite gerado (`banco.db`) pode ser aberto no VS Code com as extensões **SQLite** (alexcvzz) ou **SQLite Viewer**.
