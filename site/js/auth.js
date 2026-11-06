/* =========================================================
   auth.js — Página index.html
   - Cadastro do cliente: POST /cliente
   - Login do cliente:    POST /login
   - Ao logar, salva no LocalStorage o NOME e o TOKEN
     do cliente (CHAVE nome / token), como pedido.
   ========================================================= */
(function () {
  // Já está logado? Vai direto para o catálogo.
  if (auth.logado()) {
    location.replace('produtos.html');
    return;
  }

  const el = (id) => document.getElementById(id);
  const abaLogin = el('aba-login');
  const abaCadastro = el('aba-cadastro');
  const formLogin = el('form-login');
  const formCadastro = el('form-cadastro');
  const avisoLogin = el('aviso-login');
  const avisoCadastro = el('aviso-cadastro');

  /* ---------- alternância das abas ---------- */
  function trocarAba(mostrarLogin) {
    abaLogin.classList.toggle('ativa', mostrarLogin);
    abaCadastro.classList.toggle('ativa', !mostrarLogin);
    formLogin.hidden = !mostrarLogin;
    formCadastro.hidden = mostrarLogin;
  }
  abaLogin.addEventListener('click', () => trocarAba(true));
  abaCadastro.addEventListener('click', () => trocarAba(false));
  el('abrir-cadastro').addEventListener('click', (e) => { e.preventDefault(); trocarAba(false); });
  el('abrir-login').addEventListener('click', (e) => { e.preventDefault(); trocarAba(true); });

  /* ---------- helpers ---------- */
  function mostrarAviso(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.classList.remove('sucesso', 'erro');
    elemento.classList.add(tipo);
    elemento.hidden = false;
  }

  function processando(botao, ocupado, textoNormal) {
    botao.disabled = ocupado;
    botao.textContent = ocupado ? 'Aguarde…' : textoNormal;
  }

  /* ---------- LOGIN ---------- */
  formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const email = el('login-email').value.trim();
    const senha = el('login-senha').value;

    if (!email || !senha) {
      mostrarAviso(avisoLogin, 'Preencha o e-mail e a senha.', 'erro');
      return;
    }

    processando(el('botao-login'), true, 'Entrar');
    avisoLogin.hidden = true;
    try {
      const { ok, dados } = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });

      if (!ok) {
        mostrarAviso(avisoLogin, dados.erro || 'Falha no login. Confira os dados.', 'erro');
        return;
      }

      // 💾 Guarda no LocalStorage o nome e o token do cliente logado
      auth.entrar(dados.cliente.nome, dados.token);
      location.href = 'produtos.html';
    } catch (erro) {
      mostrarAviso(
        avisoLogin,
        'Não foi possível falar com a API. Ela está rodando? (npm start)',
        'erro'
      );
    } finally {
      processando(el('botao-login'), false, 'Entrar');
    }
  });

  /* ---------- CADASTRO ---------- */
  formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const nome = el('cad-nome').value.trim();
    const email = el('cad-email').value.trim();
    const senha = el('cad-senha').value;
    const senha2 = el('cad-senha2').value;

    if (!nome || !email) {
      mostrarAviso(avisoCadastro, 'Preencha o nome e o e-mail.', 'erro');
      return;
    }
    if (senha.length < 6) {
      mostrarAviso(avisoCadastro, 'A senha deve ter pelo menos 6 caracteres.', 'erro');
      return;
    }
    if (senha !== senha2) {
      mostrarAviso(avisoCadastro, 'As duas senhas não conferem.', 'erro');
      return;
    }

    processando(el('botao-cadastro'), true, 'Cadastrar');
    avisoCadastro.hidden = true;
    try {
      const { ok, dados } = await apiFetch('/cliente', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!ok) {
        mostrarAviso(avisoCadastro, dados.erro || 'Falha no cadastro. Tente outra vez.', 'erro');
        return;
      }

      // Conta criada → volta para a aba de login com o e-mail preenchido
      trocarAba(true);
      el('login-email').value = email;
      el('login-senha').value = '';
      el('cad-senha').value = '';
      el('cad-senha2').value = '';
      mostrarAviso(avisoLogin, 'Conta criada com sucesso! Faça login para continuar.', 'sucesso');
    } catch (erro) {
      mostrarAviso(
        avisoCadastro,
        'Não foi possível falar com a API. Ela está rodando? (npm start)',
        'erro'
      );
    } finally {
      processando(el('botao-cadastro'), false, 'Cadastrar');
    }
  });
})();
