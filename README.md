# NúcleoGestão

Sistema de gestão para cadastro e visualização de itens de inventário, construído inteiramente com **HTML5** e **CSS3** no lado do cliente, sem frameworks. Projeto acadêmico baseado nos conceitos de estrutura semântica, cascata, seletores, box model e design responsivo do livro *Use a Cabeça! HTML e CSS* (Eric Freeman & Elisabeth Robson).

## Demonstração

Abra `index.html` em qualquer navegador — não requer servidor, build ou instalação.

## Estrutura do projeto

```
├── index.html          # Página inicial (apresentação, listas, navegação)
├── cadastro.html        # Formulário de cadastro de itens
├── visualizacao.html    # Tabela, busca, resumo e exclusão de itens
├── sobre.html           # Página institucional e referência bibliográfica
├── style.css            # Folha de estilos única, compartilhada por todas as páginas
├── script.js            # Lógica de cadastro, listagem, busca e persistência
└── icone.svg            # Logotipo usado via <img>
```

## Funcionalidades

- Cadastro de itens (código, nome, categoria, quantidade, preço, observações) com validação nativa do HTML5.
- Listagem em tabela com busca em tempo real por nome ou código.
- Exclusão de itens com confirmação.
- Painel de resumo (total de itens, quantidade e valor estimado).
- Persistência dos dados no `localStorage` do navegador.

## Conceitos de HTML5 e CSS3 aplicados

- Tags semânticas: `header`, `nav`, `main`, `section`, `article`, `footer`, `figure`.
- Listas ordenadas e não ordenadas, tabelas com `thead`/`tbody`/`caption`.
- Formulário com `fieldset`, `legend`, `label` e validação nativa (`required`, `pattern`, `min`, `step`).
- Seletores CSS de tipo, classe, id, descendente, atributo e pseudo-classe (`:hover`, `:focus-visible`, `:nth-child`, `:invalid`).
- Modelo de caixa (box model) e `float` para posicionamento de imagem.
- Variáveis CSS (`:root`), Flexbox e CSS Grid para layout.
- Design responsivo mobile-first com `media queries`.

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)

## Referência bibliográfica

FREEMAN, Eric; ROBSON, Elisabeth. *Use a Cabeça! HTML e CSS*. Rio de Janeiro: Alta Books.

## Autor

Lucas — Tópicos Avançados de TI, FATEC.
