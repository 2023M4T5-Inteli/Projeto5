botao.addEventListener("click", (e) => {
  e.preventDefault();

  // Remove o elemento original
  elementoOriginal.style.display = "none";
  authBarElement.style.display = "block";

  // Exibe o elemento novo
  elementoNovo.style.display = "block";

  // Cria um novo botão
  const novoBotao = document.createElement("button");
  novoBotao.className = "cssbuttons-io-button";

  // Cria um elemento span para o texto
  const spanTexto = document.createElement("span");
  spanTexto.className = "button-text";
  spanTexto.innerHTML = "Clique Aqui";

  // Cria um elemento span para o ícone
  const spanIcone = document.createElement("span");
  spanIcone.className = "icon";

  // Cria um elemento svg
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 24 24");

  // Cria um elemento path para o ícone
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M0 0h24v24H0z");
  path.setAttribute("fill", "none");

  // Adiciona o elemento path ao svg
  svg.appendChild(path);

  // Adiciona o svg ao elemento span do ícone
  spanIcone.appendChild(svg);

  // Adiciona os elementos filho ao botão
  novoBotao.appendChild(spanTexto);
  novoBotao.appendChild(spanIcone);

  // Adiciona o novo botão ao elemento novo
  elementoNovo.appendChild(novoBotao);
});