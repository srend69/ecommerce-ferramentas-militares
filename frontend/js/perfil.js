/* =========================================================
   perfil.js — Página perfil.html
   Consome GET /cliente/perfil (rota protegida por JWT),
   enviando o token que está no LocalStorage.
   ========================================================= */
(function () {
  montarCabecalho('perfil');

  const conteudo = document.getElementById('conteudo-perfil');
  const botaoSair = document.getElementById('botao-sair');
  botaoSair.addEventListener('click', auth.sair);

  if (!auth.logado()) {
    conteudo.innerHTML = `
      <p class="aviso-estatico">🔒 Você precisa estar <strong>logado</strong> para ver o perfil.</p>
      <a class="botao botao-primario" href="index.html">Ir para login / cadastro</a>`;
    return;
  }

  (async function carregarPerfil() {
    const { ok, status, dados } = await apiFetch('/cliente/perfil');

    if (!ok) {
      // Token ausente, inválido ou expirado → limpa o login local
      localStorage.removeItem('token');
      localStorage.removeItem('nome');
      conteudo.innerHTML = `
        <p class="aviso-estatico">${
          status === 401
            ? '⌛ Sessão expirada ou token inválido. Faça login novamente.'
            : '❌ Não foi possível carregar o perfil. A API está rodando? (npm start)'
        }</p>
        <a class="botao botao-primario" href="index.html">Ir para login / cadastro</a>`;
      return;
    }

    const c = dados.cliente;
    const dataCadastro = c.criado_em
      ? new Date(String(c.criado_em).replace(' ', 'T') + 'Z').toLocaleString('pt-BR')
      : '—';

    conteudo.innerHTML = `
      <dl class="lista-perfil">
        <div><dt>Nome</dt><dd>${c.nome}</dd></div>
        <div><dt>E-mail</dt><dd>${c.email}</dd></div>
        <div><dt>Id do cliente</dt><dd>#${c.id}</dd></div>
        <div><dt>Cadastrado em</dt><dd>${dataCadastro}</dd></div>
      </dl>
      <p class="explicacao">
        Estes dados vieram da rota <code>GET /cliente/perfil</code>, que só responde
        quando o cabeçalho <code>Authorization: Bearer &lt;token&gt;</code> é válido.
      </p>`;
  })();
})();
