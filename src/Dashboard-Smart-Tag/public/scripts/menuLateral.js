// Obtém referências para os elementos
const btn_menu = document.querySelector(".btn-menu");
      const side_bar = document.querySelector(".sidebar");
      const searchOption = document.getElementById("bx bx-search search-btn");
      const searchInput = document.getElementById("campo-pesquisar");

      btn_menu.addEventListener("click", function () {
        side_bar.classList.toggle("expand");
        changebtn();
      });


    // Adiciona um ouvinte de evento de clique à opção de pesquisa
    searchOption.addEventListener("click", function(event) {
      // Verifica se o clique foi no ícone de pesquisa
      if (event.target.classList.contains("search-btn")) {
        // Expande a sidebar
        side_bar.classList.add("expand");

        // Foca o campo de texto
        searchInput.focus();

        searchInput.style.cursor = 'text';

        // Impede o redirecionamento da página
        event.preventDefault();
      }
    });

      // Muda o layout do botão sanduíche da sidebar
      function changebtn() {
        if (side_bar.classList.contains("expand")) {
          btn_menu.classList.replace("bx-menu", "bx-menu-alt-right");
        } else {
          btn_menu.classList.replace("bx-menu-alt-right", "bx-menu");
        }

      }