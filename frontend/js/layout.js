/* =========================================================
   layout.js — Cabeçalho compartilhado + navegação com
   estado de login (nome do cliente salvo no LocalStorage).
   ========================================================= */

function montarCabecalho(paginaAtiva = '') {
  const cabecalho = document.getElementById('cabecalho');
  if (!cabecalho) return;

  const logado = auth.logado();

  const parteLogado = logado
    ? `<a href="perfil.html" class="link ${paginaAtiva === 'perfil' ? 'ativo' : ''}">Perfil</a>
       <span class="usuario" title="${auth.nome()}">👤 ${auth.nome()}</span>
       <button id="botao-sair-header" class="botao botao-fantasma botao-pequeno" type="button">Sair</button>`
    : `<a href="index.html" class="link">Entrar / Cadastrar</a>`;

  cabecalho.innerHTML = `
    <div class="cabecalho-interno container">
      <a class="marca" href="produtos.html">
        <span class="marca-simbolo">🪖</span>
        <span class="marca-texto">MILGEAR<small>Ferramentas de uso militar</small></span>
      </a>
      <nav class="navegacao">
        <a href="produtos.html" class="link ${paginaAtiva === 'produtos' ? 'ativo' : ''}">Produtos</a>
        ${parteLogado}
      </nav>
    </div>`;

  const botaoSair = document.getElementById('botao-sair-header');
  if (botaoSair) botaoSair.addEventListener('click', auth.sair);
}
