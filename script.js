// =========================================================
// NúcleoGestão — script.js
// Compartilhado entre cadastro.html e visualizacao.html
// =========================================================

(function () {
  'use strict';

  const CHAVE_ARMAZENAMENTO = 'nucleogestao.itens';

  const formulario = document.getElementById('formulario-cadastro');
  const corpoTabela = document.getElementById('corpo-tabela');
  const estadoVazio = document.getElementById('estado-vazio');
  const campoBusca = document.getElementById('busca');
  const mensagemFormulario = document.getElementById('mensagem-formulario');

  const totalItensEl = document.getElementById('total-itens');
  const totalQuantidadeEl = document.getElementById('total-quantidade');
  const totalValorEl = document.getElementById('total-valor');

  const rotulosCategoria = {
    'mobiliario': 'Mobiliário',
    'eletronico': 'Eletrônico',
    'material-escritorio': 'Material de escritório',
    'outro': 'Outro'
  };

  let itens = carregarItens();

  function carregarItens() {
    try {
      const bruto = localStorage.getItem(CHAVE_ARMAZENAMENTO);
      return bruto ? JSON.parse(bruto) : [];
    } catch (erro) {
      console.error('Não foi possível carregar os itens salvos:', erro);
      return [];
    }
  }

  function salvarItens() {
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itens));
    } catch (erro) {
      console.error('Não foi possível salvar os itens:', erro);
    }
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  function gerarId() {
    return `item-${Date.now()}-${Math.round(Math.random() * 1000)}`;
  }

  function exibirMensagem(texto, tipo) {
    if (!mensagemFormulario) return;
    mensagemFormulario.textContent = texto;
    mensagemFormulario.className = 'mensagem ' + (tipo === 'erro' ? 'mensagem--erro' : 'mensagem--sucesso');
    if (texto) {
      window.setTimeout(() => {
        mensagemFormulario.textContent = '';
        mensagemFormulario.className = 'mensagem';
      }, 4000);
    }
  }

  // ---------- Lógica do formulário (só roda em cadastro.html) ----------
  if (formulario) {
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        exibirMensagem('Revise os campos destacados antes de continuar.', 'erro');
        return;
      }

      const dados = new FormData(formulario);
      const codigo = String(dados.get('codigo')).trim();

      const codigoJaExiste = itens.some((item) => item.codigo.toLowerCase() === codigo.toLowerCase());
      if (codigoJaExiste) {
        exibirMensagem(`O código "${codigo}" já está cadastrado. Use outro código.`, 'erro');
        document.getElementById('codigo').focus();
        return;
      }

      const novoItem = {
        id: gerarId(),
        codigo,
        nome: String(dados.get('nome')).trim(),
        categoria: String(dados.get('categoria')),
        quantidade: Number(dados.get('quantidade')),
        preco: Number(dados.get('preco')),
        observacoes: String(dados.get('observacoes') || '').trim()
      };

      itens.unshift(novoItem);
      salvarItens();
      formulario.reset();
      document.getElementById('quantidade').value = 1;
      exibirMensagem(`Item "${novoItem.nome}" cadastrado com sucesso. Veja em "Visualizar".`, 'sucesso');
      document.getElementById('codigo').focus();
    });
  }

  // ---------- Lógica da tabela (só roda em visualizacao.html) ----------
  if (corpoTabela) {
    const atualizarResumo = () => {
      const totalItens = itens.length;
      const totalQuantidade = itens.reduce((soma, item) => soma + item.quantidade, 0);
      const totalValor = itens.reduce((soma, item) => soma + item.quantidade * item.preco, 0);

      if (totalItensEl) totalItensEl.textContent = totalItens;
      if (totalQuantidadeEl) totalQuantidadeEl.textContent = totalQuantidade;
      if (totalValorEl) totalValorEl.textContent = formatarMoeda(totalValor);
    };

    const criarLinha = (item) => {
      const linha = document.createElement('tr');
      linha.dataset.id = item.id;
      const total = item.quantidade * item.preco;

      linha.innerHTML = `
        <td>${escaparHtml(item.codigo)}</td>
        <td>${escaparHtml(item.nome)}</td>
        <td>${escaparHtml(rotulosCategoria[item.categoria] || item.categoria)}</td>
        <td>${item.quantidade}</td>
        <td>${formatarMoeda(item.preco)}</td>
        <td>${formatarMoeda(total)}</td>
        <td>
          <button type="button" class="botao--perigo" data-acao="excluir" data-id="${item.id}"
                  aria-label="Excluir item ${escaparHtml(item.nome)}">
            Excluir
          </button>
        </td>
      `;
      return linha;
    };

    const renderizarTabela = (listaFiltrada) => {
      const lista = listaFiltrada || itens;
      corpoTabela.innerHTML = '';

      if (lista.length === 0) {
        estadoVazio.classList.add('ativo');
      } else {
        estadoVazio.classList.remove('ativo');
        const fragmento = document.createDocumentFragment();
        lista.forEach((item) => fragmento.appendChild(criarLinha(item)));
        corpoTabela.appendChild(fragmento);
      }
      atualizarResumo();
    };

    const aplicarBusca = () => {
      const termo = campoBusca ? campoBusca.value.trim().toLowerCase() : '';
      if (!termo) {
        renderizarTabela();
        return;
      }
      const filtrados = itens.filter((item) =>
        item.nome.toLowerCase().includes(termo) || item.codigo.toLowerCase().includes(termo)
      );
      renderizarTabela(filtrados);
    };

    corpoTabela.addEventListener('click', function (evento) {
      const botao = evento.target.closest('[data-acao="excluir"]');
      if (!botao) return;

      const id = botao.dataset.id;
      const item = itens.find((i) => i.id === id);
      if (!item) return;

      const confirmar = window.confirm(`Excluir o item "${item.nome}" (${item.codigo})?`);
      if (!confirmar) return;

      itens = itens.filter((i) => i.id !== id);
      salvarItens();
      aplicarBusca();
    });

    if (campoBusca) campoBusca.addEventListener('input', aplicarBusca);

    renderizarTabela();
  }
})();
