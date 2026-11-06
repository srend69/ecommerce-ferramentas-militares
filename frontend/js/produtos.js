/* =========================================================
   produtos.js — Página produtos.html (catálogo).
   Consome GET /produto com TODOS os filtros do enunciado:
     ?nome=..., &ordem=menor|maior, &categoria=...,
     &preco_min=...&preco_max=..., &pagina=N
   Limite fixo no servidor: 10 produtos por página.
   Os filtros também ficam na URL (podem ser compartilhados).
   ========================================================= */
(function () {
  montarCabecalho('produtos');

  const el = (id) => document.getElementById(id);
  const entradaNome = el('f-nome');
  const selecaoOrdem = el('f-ordem');
  const selecaoCategoria = el('f-categoria');
  const entradaMin = el('f-min');
  const entradaMax = el('f-max');
  const resumo = el('resumo');
  const grade = el('lista-produtos');
  const vazio = el('estado-vazio');
  const paginacao = el('paginacao');
  const modal = el('modal-produto');
  const modalConteudo = el('modal-conteudo');

  /* ---------- estado dos filtros ---------- */
  const estado = { nome: '', ordem: '', categoria: '', precoMin: '', precoMax: '', pagina: 1 };

  // Restaura filtros da URL (produtos.html?categoria=ferramenta&pagina=2 ...)
  const daURL = new URLSearchParams(location.search);
  estado.nome = daURL.get('nome') || '';
  estado.ordem = daURL.get('ordem') || '';
  estado.categoria = daURL.get('categoria') || '';
  estado.precoMin = daURL.get('preco_min') || '';
  estado.precoMax = daURL.get('preco_max') || '';
  estado.pagina = Math.max(1, parseInt(daURL.get('pagina'), 10) || 1);

  entradaNome.value = estado.nome;
  selecaoOrdem.value = estado.ordem;
  entradaMin.value = estado.precoMin;
  entradaMax.value = estado.precoMax;

  /* ---------- categorias (GET /produto/categorias) ---------- */
  (async function carregarCategorias() {
    const { ok, dados } = await apiFetch('/produto/categorias');
    if (ok && Array.isArray(dados.categorias)) {
      dados.categorias.forEach((c) => {
        const opc = document.createElement('option');
        opc.value = c.slug;
        opc.textContent = `${c.label} (${c.quantidade})`;
        selecaoCategoria.appendChild(opc);
      });
      selecaoCategoria.value = estado.categoria;
      if (selecaoCategoria.value !== estado.categoria) {
        selecaoCategoria.value = ''; // categoria da URL não existe mais
      }
    }
  })();

  /* ---------- montagem da query ---------- */
  function construirQuery(pagina) {
    const q = new URLSearchParams();
    if (estado.nome) q.set('nome', estado.nome);
    if (estado.ordem) q.set('ordem', estado.ordem); // menor | maior
    if (estado.categoria) q.set('categoria', estado.categoria); // ex.: categoria=ferramenta
    if (estado.precoMin) q.set('preco_min', estado.precoMin); // ex.: preco_min=200
    if (estado.precoMax) q.set('preco_max', estado.precoMax); // ex.: preco_max=700
    if (pagina > 1) q.set('pagina', String(pagina)); // ex.: pagina=2
    return q.toString();
  }

  function sincronizarURL() {
    const query = construirQuery(estado.pagina);
    history.replaceState(null, '', query ? `produtos.html?${query}` : 'produtos.html');
  }

  /* ---------- busca e renderização ---------- */
  async function buscar(pagina) {
    estado.pagina = pagina;
    grade.innerHTML = '<p class="carregando">Carregando produtos…</p>';
    vazio.hidden = true;
    paginacao.innerHTML = '';
    resumo.textContent = '';

    const query = construirQuery(pagina);
    const { ok, dados } = await apiFetch(`/produto${query ? '?' + query : ''}`);

    if (!ok || !Array.isArray(dados.produtos)) {
      grade.innerHTML =
        '<p class="carregando">❌ Não foi possível carregar a lista. Verifique se a API está rodando (npm start).</p>';
      return;
    }

    sincronizarURL();
    resumo.textContent =
      `${dados.total} produto(s) encontrado(s) · página ${dados.pagina} de ${dados.totalPaginas} ` +
      `· limite fixo de ${dados.limite} por página`;

    if (dados.produtos.length === 0) {
      grade.innerHTML = '';
      vazio.hidden = false;
      return;
    }

    grade.innerHTML = dados.produtos.map(cartaoProduto).join('');
    grade.querySelectorAll('.detalhe').forEach((botao) => {
      botao.addEventListener('click', () => abrirModal(Number(botao.dataset.id)));
    });

    desenharPaginacao(dados.pagina, dados.totalPaginas);
  }

  /* ---------- cartão de produto ---------- */
  function figura(p, classeExtra = '') {
    const cat = infoCategoria(p.categoria);
    const imagemExterna = typeof p.imagem === 'string' && /^(https?:|data:)/i.test(p.imagem);
    if (imagemExterna) {
      return `<div class="figura ${classeExtra}"><img src="${p.imagem}" alt="${p.nome}" loading="lazy" /></div>`;
    }
    return `<div class="figura ${classeExtra}" style="background:linear-gradient(135deg, #2a3425, #1b211a)">
      <span>${p.imagem || cat.emoji}</span></div>`;
  }

  function cartaoProduto(p) {
    const cat = infoCategoria(p.categoria);
    return `
      <article class="cartao produto">
        ${figura(p)}
        <div class="corpo-produto">
          <span class="etiqueta">${cat.label}</span>
          <h3>${p.nome}</h3>
          <p class="descricao">${p.descricao || ''}</p>
          <div class="rodape-produto">
            <strong class="preco">${formatarPreco(p.preco)}</strong>
            <button class="botao botao-contorno detalhe" data-id="${p.id}" type="button">Ver detalhes</button>
          </div>
        </div>
      </article>`;
  }

  /* ---------- paginação ---------- */
  function desenharPaginacao(pagina, totalPaginas) {
    if (totalPaginas <= 1) return;

    const botao = (texto, destino, ativo = false, inativo = false) => `
      <button class="pg ${ativo ? 'ativo' : ''}" data-pg="${destino}"
        ${inativo ? 'disabled' : ''} type="button">${texto}</button>`;

    let html = botao('← Anterior', pagina - 1, false, pagina === 1);
    for (let p = 1; p <= totalPaginas; p += 1) {
      html += botao(p, p, p === pagina);
    }
    html += botao('Próxima →', pagina + 1, false, pagina === totalPaginas);

    paginacao.innerHTML = html;
    paginacao.querySelectorAll('.pg').forEach((b) => {
      b.addEventListener('click', () => buscar(Number(b.dataset.pg)));
    });
  }

  /* ---------- modal de detalhe (GET /produto/:id) ---------- */
  async function abrirModal(id) {
    modalConteudo.innerHTML = '<p class="carregando">Carregando detalhes…</p>';
    modal.showModal();

    const { ok, dados } = await apiFetch(`/produto/${id}`);
    if (!ok) {
      modalConteudo.innerHTML = '<p class="carregando">Produto não encontrado.</p>';
      return;
    }

    const cat = infoCategoria(dados.categoria);
    modalConteudo.innerHTML = `
      <div class="grade-modal">
        ${figura(dados, 'figura-grande')}
        <div class="detalhe-texto">
          <span class="etiqueta">${cat.label}</span>
          <h2>${dados.nome}</h2>
          <p>${dados.descricao || '—'}</p>
          <p class="preco preco-detalhe">${formatarPreco(dados.preco)}</p>
          <p class="estoque">📦 Estoque: <strong>${dados.estoque} unidade(s)</strong></p>
        </div>
      </div>`;
  }

  el('modal-fechar').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.close(); // cliques no fundo escuro
  });

  /* ---------- eventos dos filtros ---------- */
  el('botao-filtrar').addEventListener('click', () => {
    const min = entradaMin.value;
    const max = entradaMax.value;
    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      resumo.textContent = '⚠️ O preço mínimo não pode ser maior que o preço máximo.';
      return;
    }
    estado.nome = entradaNome.value.trim();
    estado.ordem = selecaoOrdem.value;
    estado.categoria = selecaoCategoria.value;
    estado.precoMin = min;
    estado.precoMax = max;
    buscar(1); // filtro novo sempre volta para a página 1
  });

  entradaNome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') el('botao-filtrar').click();
  });

  el('botao-limpar').addEventListener('click', () => {
    entradaNome.value = '';
    selecaoOrdem.value = '';
    selecaoCategoria.value = '';
    entradaMin.value = '';
    entradaMax.value = '';
    estado.nome = '';
    estado.ordem = '';
    estado.categoria = '';
    estado.precoMin = '';
    estado.precoMax = '';
    buscar(1);
  });

  /* ---------- primeira busca ---------- */
  buscar(estado.pagina);
})();
