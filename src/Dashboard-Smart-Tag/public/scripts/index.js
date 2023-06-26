// Configurações do Firebase (obtidas no console do Firebase)
const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_DOMINIO.firebaseapp.com',
  databaseURL: 'https://SEU_DOMINIO.firebaseio.com',
  projectId: 'SEU_PROJECT_ID',
  storageBucket: 'SEU_BUCKET.appspot.com',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
  measurementId: 'SUA_MEASUREMENT_ID',
};
      // Inicializar o Firebase
      firebase.initializeApp(firebaseConfig);

      // Referências de autenticação e banco de dados
      const auth = firebase.auth();
      const db = firebase.database();

      // Função para converter um tempo em epoch para um objeto Date do JavaScript
      function epochToJsDate(epochTime) {
          return new Date(epochTime * 1000);
      }

      // Função para converter um tempo em epoch para o formato legível 
      function epochToDateTime(epochTime) {
          var epochDate = new Date(epochToJsDate(epochTime));
          var dateTime = epochDate.getDate() + "/" +
              ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
              ("00" + epochDate.getFullYear()).slice(-2) + " " +
              ("00" + epochDate.getHours()).slice(-2) + ":" +
              ("00" + epochDate.getMinutes()).slice(-2) + ":" +
              ("00" + epochDate.getSeconds()).slice(-2);

          return dateTime;
      }

      // Função para plotar valores nos gráficos
      function plotValues(chart, timestamp, value) {
          var x = epochToJsDate(timestamp).getTime();
          var y = Number(value);
          if (chart.series[0].data.length > 40) {
              chart.series[0].addPoint([x, y], true, true, true);
          } else {
              chart.series[0].addPoint([x, y], true, false, true);
          }
      }
      // Função para plotar valores nos gráficos
      function plotValues2(chart, timestamp, value) {
          var x = epochToJsDate(timestamp).getTime();
          var y = Number(value);
          if (chart.series[1].data.length > 40) {
            chart.series[1].addPoint([x, y], true, true, true);
        } else {
            chart.series[1].addPoint([x, y], true, false, true);
        }
      }

      // Elementos DOM

      const sideBarElement = document.getElementById('sidebar');
      const navHeader = document.getElementsByClassName('nav-header');
      const homeElement = document.getElementById('home');
      const loginElement = document.querySelector('#login-form');
      const contentElement = document.querySelector("#content-sign-in");
      const userDetailsElement = document.querySelector('#user-details');
      const authBarElement = document.querySelector('#authentication-bar');
      const deleteButtonElement = document.getElementById('delete-button');
      const deleteModalElement = document.getElementById('delete-modal');
      const deleteDataFormElement = document.querySelector('#delete-data-form');
      const viewDataButtonElement = document.getElementById('view-data-button');
      const hideDataButtonElement = document.getElementById('hide-data-button');
      const tableContainerElement = document.querySelector('#table-container');
      const cardElement = document.getElementById('card-checkbox');
      const chartsRangeInputElement = document.getElementById('charts-range');
      const loadDataButtonElement = document.getElementById('load-data');
      const cardsCheckboxElement = document.querySelector('input[name=cards-checkbox]');
      const gaugesCheckboxElement = document.querySelector('input[name=gauges-checkbox]');
      const chartsCheckboxElement = document.querySelector('input[name=charts-checkbox]');

      // Elementos DOM para leituras
      const textoStatus = document.querySelector("#status");
      const bolinhaStatus = document.querySelector("#bolinha");
      const elementoNovo = document.getElementById("elemento-novo");
      const cardsReadingsElement = document.querySelector("#cards-div");
      const gaugesReadingsElement = document.querySelector("#gauges-div");
      const chartsDivElement = document.querySelector('#charts-div');
      const tempElement = document.getElementById("temp");
      const distanceElement = document.getElementById("distance");
      const updateElement = document.getElementById("lastUpdate")
      const labelElement = document.querySelector("#meu-label");

      // Administrar Interface de usuário do LOGIN/LOGOUT
      const setupUI = (user) => {
          if (user) {
              // Obter o UID do usuário para obter dados do banco de dados
              var uid = user.uid;
              console.log(uid);

              // Caminho da Base de Dados (com o UID de usuário)
              var dbPath = 'UsersData/' + uid.toString() + '/readings';
              var chartPath = 'UsersData/' + uid.toString() + '/charts/range';

              // Referências do banco de dados
              var dbRef = firebase.database().ref(dbPath);
              var chartRef = firebase.database().ref(chartPath);

              //CHECKBOXES
              // Checbox (cards para informações)
              if (cardsCheckboxElement.checked) {
                  cardsReadingsElement.style.display = 'block';
              } else {
                  cardsReadingsElement.style.display = 'none';
              }
              // Checbox (gauges para verificar a força do sinal)
              if (gaugesCheckboxElement.checked) {
                  gaugesReadingsElement.style.display = 'block';
              } else {
                  gaugesReadingsElement.style.display = 'none';
              }
              // Checbox (Gráficos para informações)
              if (chartsCheckboxElement.checked) {
                  chartsDivElement.style.display = 'block';
              } else {
                  chartsDivElement.style.display = 'none';
              }
              //Alternando elementos da interface
              loginElement.style.display = 'none';
              contentElement.style.display = 'block';
              authBarElement.style.display = 'block';
              userDetailsElement.style.display = 'block';
              userDetailsElement.innerHTML = user.email;
              sideBarElement.style.display = 'block';
              homeElement.style.display = 'block';
              chartsDivElement.style.display = 'none';
              cardsReadingsElement.style.display = 'none';
              gaugesReadingsElement.style.display = 'none';
              cardsCheckboxElement.style.display = 'block';
              gaugesCheckboxElement.style.display = 'block';
              chartsCheckboxElement.style.display = 'block';
              cardElement.style.display = 'none';


              const btn_theme = document.querySelector(".theme-btn");
              const theme_ball = document.querySelector(".theme-ball");

              const localData = localStorage.getItem("theme");

                              // ...
                if (localData == "dark") {
                    document.body.classList.add("dark-mode");
                    theme_ball.classList.add("dark");
                    updateChartColors(true);
                } else if (localData == "light") {
                    document.body.classList.remove("dark-mode");
                    theme_ball.classList.remove("dark");
                    updateChartColors(false);
                }
                // ...
  

              btn_theme.addEventListener("click", function() {
                  document.body.classList.toggle("dark-mode");
                  theme_ball.classList.toggle("dark");
                  if (document.body.classList.contains("dark-mode")) {
                      localStorage.setItem("theme", "dark");
                      updateChartColors(true);
                  } else {
                      localStorage.setItem("theme", "light");
                      updateChartColors(false);
                  }
              });

              homeElement.style.top = "0px";


                // CHARTS
                // Número de leituras a serem plotadas nos gráficos
                var chartRange = 0;
                // Obtenha o número de leituras a serem plotadas salvas no banco de dados (executado quando a página é carregada pela primeira vez e sempre que houver uma alteração no banco de dados)
              chartRef.on('value', snapshot => {
                  chartRange = Number(snapshot.val());
                  console.log(chartRange);
                  // Excluir todos os dados dos gráficos para atualizar com novos valores quando uma nova faixa for selecionada
                chartT.destroy();
                // Renderizar novos gráficos para exibir a nova faixa de dados
                chartT = createTemperatureChart();
                // Atualize os gráficos com a nova faixa
                // Obter as leituras mais recentes e plotá-las nos gráficos (o número de leituras plotadas corresponde ao valor de chartRange)
                dbRef.orderByKey().limitToLast(chartRange).on('child_added', parentSnapshot => {
                    // Ação para cada nó filho do caminho principal
                    parentSnapshot.forEach(childSnapshot => {
                        // Ação para cada nó filho dentro do nó filho do caminho principal
                        var jsonData = childSnapshot.toJSON();
                        // Salve os valores em variáveis e faça o plot nos gráficos
                        var temperature = jsonData.temperature;
                        var timestamp = jsonData.timestamp;
                        var distance = jsonData.distance;
                        plotValues(chartT, timestamp, temperature);
                        plotValues2(chartT, timestamp, distance);
                    });
                });
              });

              // Atualize o banco de dados com a nova faixa (campo de entrada)
              chartsRangeInputElement.onchange = () => {
                  chartRef.set(chartsRangeInputElement.value);
              };

              // CHECKBOXES
              // Checkbox (cartões para leituras de sensores)
              cardsCheckboxElement.addEventListener('change', (e) => {
                  if (cardsCheckboxElement.checked) {
                      cardsReadingsElement.style.display = 'block';
                  } else {
                      cardsReadingsElement.style.display = 'none';
                  }
              });
            // Checkbox (medidores para leituras de sensores)
            gaugesCheckboxElement.addEventListener('change', (e) => {
                if (gaugesCheckboxElement.checked) {
                    gaugesReadingsElement.style.display = 'block';
                } else {
                    gaugesReadingsElement.style.display = 'none';
                }
            });
            // Checkbox (gráficos para leituras de sensores)
            chartsCheckboxElement.addEventListener('change', (e) => {
                if (chartsCheckboxElement.checked) {
                    chartsDivElement.style.display = 'block';
                } else {
                    chartsDivElement.style.display = 'none';
                }
            });
              

              const botaoDispositivos = document.querySelector("#dispositivos-option");
              const elementoNovo = document.getElementById("elemento-novo");
              const elementoOriginal = document.getElementById("hero-content");

              botaoDispositivos.addEventListener("click", (e) => {
                  e.preventDefault();

                  // Remove o elemento original
                  $(elementoOriginal).empty();
                  authBarElement.style.display = "block";
                  createDevices();

                  // Exibe o elemento novo
                  elementoNovo.style.display = "block";

              });


              // CARDS
              // Obtenha as leituras mais recentes e exiba-as nos cartões
              dbRef.orderByKey().limitToLast(1).on('child_added', parentSnapshot => {
                  parentSnapshot.forEach(childSnapshot => {
                      var jsonData = childSnapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
                      var temperature = jsonData.temperature;
                      var timestamp = jsonData.timestamp;
                      // Atualizar elementos do DOM
                      tempElement.innerHTML = temperature;
                      updateElement.innerHTML = epochToDateTime(timestamp);
                      const signalIcon = document.getElementById('signal-icon');

                      if (temperature > -70) {
                          textoStatus.textContent = 'Sinal bom';
                          textoStatus.style.color = 'green';
                          signalIcon.style.color = 'green';
                      } else {
                          textoStatus.textContent = 'Sinal ruim';
                          textoStatus.style.color = 'orange';
                          signalIcon.style.color = 'orange';
                      }
                  });
              });

                // DISTANCIA
                // Obter as últimas leituras e exibir nos cards
                dbRef.orderByKey().limitToLast(1).on('child_added', parentSnapshot => {
                    parentSnapshot.forEach(childSnapshot => {
                    var jsonData = childSnapshot.toJSON(); // exemplo: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
                    var distance = jsonData.distance;
                    var timestamp = jsonData.timestamp;
                    // Atualizar elementos do DOM
                    distanceElement.innerHTML = distance;
                    updateElement.innerHTML = epochToDateTime(timestamp);

                  });
              });

            // GAUGES
            // Obter as últimas leituras e exibir nos medidores
            dbRef.orderByKey().limitToLast(1).on('child_added', parentSnapshot => {
                parentSnapshot.forEach(childSnapshot => {
                    var jsonData = childSnapshot.toJSON(); // exemplo: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
                    var temperature = jsonData.temperature;
                    var timestamp = jsonData.timestamp;
                    // Atualizar elementos do DOM
                    var gaugeT = createTemperatureGauge();
                    gaugeT.draw();
                    gaugeT.value = temperature;
                    updateElement.innerHTML = epochToDateTime(timestamp);
                });
              });

            // DELETAR DADOS
// Adicionar evento de clique para abrir o modal ao clicar no botão "Excluir dados"
            deleteButtonElement.addEventListener('click', e => {
                console.log("Remove data");
                e.preventDefault;
                deleteModalElement.style.display = "block";
            });

            // Adicionar evento de envio do formulário de exclusão
            deleteDataFormElement.addEventListener('submit', (e) => {
                // Excluir dados (leituras)
                  dbRef.remove();
              });

              // TABELA
              var lastReadingTimestamp; // salva o último timestamp exibido na tabela

              function createDevices() {
                var processedDevices = new Map();
              
                dbRef.orderByKey().limitToLast(1000000).on('value', function(snapshot) {
                  snapshot.forEach(parentSnapshot => {
                    parentSnapshot.forEach(childSnapshot => {
                      if (childSnapshot.exists()) {
                        var jsonData = childSnapshot.val();
                        var device = childSnapshot.ref.key;
                        var distance = jsonData.distance;
                        var setor = jsonData.setor;
                        var houveMudanca = jsonData.houveMudanca;



              
                        if (!processedDevices.has(device)) {
                          var novoBotao2 = '';
                          novoBotao2 += '<div class="container"><button class="cssbuttons-io-button" id="btnEnviar" data-device="' + device + '">';
                          novoBotao2 += '<span class="button-text">' + device + '<br><span>' + distance + ' metros de distância do roteador</span></span>';
                          novoBotao2 += '</button>';
                          novoBotao2 += '<span class="meuLabel" id="label-' + device + '">' + setor + '</span></div>';
                          $(elementoOriginal).prepend(novoBotao2);
                          processedDevices.set(device, setor);
                          // Adicionar o novo botão e registrar o dispositivo e setor correspondentes
                        } else {
                          var existingButton = $('button[data-device="' + device + '"]');
                          existingButton.find('.button-text span').text(distance + ' metros de distância do roteador');
                          // Atualizar a distância exibida no botão existente

                          var previousSetor = processedDevices.get(device);
              
                          if (setor !== previousSetor) {
                            var labelElement = document.getElementById('label-' + device);
                            labelElement.textContent = setor;
              
                            // Verificar se o valor do campo setor é diferente do anterior
                            if (setor !== previousSetor) {
                              // Adicionar classe 'changed' para reiniciar a animação
                              labelElement.classList.add('changed');
                              //enviarEmail(setor);
                            }
              
                            // Atualizar o valor do campo setor no map
                            processedDevices.set(device, setor);
                          }
                        }


                        // Verificar se houve mudança no valor do campo setor e atualizar o elemento de rótulo correspondente
                        var buttonElement = $('button[data-device="' + device + '"]');
                        buttonElement.click(function() {
                            // Executar o comando correspondente ao botão clicado
                            $(elementoOriginal).empty();
                            $(elementoOriginal).append(cardElement);
                            $(elementoOriginal).append(cardsReadingsElement);
                            $(elementoOriginal).append(gaugesReadingsElement);
                            $(elementoOriginal).append(chartsDivElement);
                            chartsDivElement.style.display = 'block';
                            cardsReadingsElement.style.display = 'block';
                            gaugesReadingsElement.style.display = 'block';
                            cardElement.style.display = 'block';

                            // Atualizar elementos do DOM e exibir os respectivos conteúdos quando um botão é clicado
                        });
                      }
                    });
                  });
                });
                
              }
                        
              

                // Função para realizar a pesquisa no banco de dados
function pesquisarDispositivos(palavraChave) {
    var firstRun = true;
    var processedDevices = new Map();
    dbRef.orderByKey().limitToLast(1000000).on('child_added', function(parentSnapshot) {
      parentSnapshot.forEach(childSnapshot => {
        if (childSnapshot.exists()) {
          var jsonData = childSnapshot.toJSON();
          var device = childSnapshot.ref.key;
          var setor = jsonData.setor;
          
          // Verifica se a palavra-chave está presente no dispositivo
          if (device.startsWith(palavraChave)) {
            // Se a palavra-chave for encontrada, faça o que deseja com o resultado
            console.log(jsonData);
            var distance = jsonData.distance;
  
            if (!processedDevices.has(device)) {
                var novoBotao2 = '';
                novoBotao2 += '<div class="container"><button class="cssbuttons-io-button" data-device="' + device + '">';
                novoBotao2 += '<span class="button-text">' + device + '<br><span>' + distance + ' metros de distância do roteador</span></span>';
                novoBotao2 += '</button>';
                novoBotao2 += '<span class="meuLabel" id="label-' + device + '">' + setor + '</span></div>';
                $(elementoOriginal).prepend(novoBotao2);
                processedDevices.set(device, setor);
            } else {
              var existingButton = $('button[data-device="' + device + '"]');
              existingButton.find('.button-text span').text(distance + ' metros de distância do roteador');

              var previousSetor = processedDevices.get(device);
              
              if (setor !== previousSetor) {
                var labelElement = document.getElementById('label-' + device);
                labelElement.textContent = setor;
  
                // Verificar se o valor do campo setor é diferente do anterior
                if (setor !== previousSetor) {
                  // Adicionar classe 'changed' para reiniciar a animação
                  labelElement.classList.add('changed');
                }
  
                // Atualizar o valor do campo setor no mapa
                processedDevices.set(device, setor);
              }

            }
  
            if (firstRun) {
              lastReadingTimestamp = timestamp;
              firstRun = false;
              console.log(lastReadingTimestamp);
            }
          }
        }
      });
    });
  }
  // Obtendo o elemento de entrada de texto da barra de pesquisa

var searchInput = document.getElementById('campo-pesquisar');

var searchIcon = document.querySelector('.search-btn');
// Adicionando evento de clique no ícone de pesquisa
searchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    if (sideBarElement.classList.contains('expand') && searchInput.value.trim() !== '') {
        pesquisar();
    }
    else  {
        searchInput.focus();
    }
});
  
  // Adicionando evento de pressionamento da tecla Enter no campo de texto
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      pesquisar();
    }
  });
  
  // Função para executar a pesquisa
  function pesquisar() {
    // Obtendo o valor digitado na barra de pesquisa
    var searchValue = searchInput.value;
  
    // Limpando os elementos existentes
    $(elementoOriginal).empty();
  
    // Realizando a pesquisa
    pesquisarDispositivos(searchValue);
  }
              

// coloca as leituras na tabela (depois de pressionar o botão "Mais Resultados")
function appendToTable() {
    var dataList = []; // salva a lista de leituras retornadas pelo snapshot (da mais antiga para a mais recente)
    var reversedList = []; // a mesma lista, mas invertida (da mais recente para a mais antiga)
    console.log("APEND");
    dbRef.orderByKey().limitToLast(10).endAt(lastReadingTimestamp).once('value', function(parentSnapshot) {
      // converter o snapshot para JSON
      parentSnapshot.forEach(childSnapshot => {
        if (childSnapshot.exists()) {
          snapshot.forEach(childElement => {
            var jsonData = childElement.toJSON();
            dataList.push(jsonData); // criar uma lista com todos os dados
          });
          lastReadingTimestamp = dataList[0].timestamp; // o timestamp mais antigo corresponde ao primeiro da lista (mais antigo --> mais recente)
          reversedList = dataList.reverse(); // inverter a ordem da lista (mais recente --> mais antigo)
  

                              var firstTime = true;
                              // percorrer todos os elementos da lista e adicionar à tabela (elementos mais recentes primeiro)
                              reversedList.forEach(childElement => {
                                  if (firstTime) { // ignorar a primeira leitura (já está na tabela a partir da consulta anterior)
                                      firstTime = false;
                                  } else {
                                      var setor = childElement.setor;
                                      var timestamp = childElement.timestamp;
                                      var distance = childElement.distance;
                                      var device = childSnapshot.ref.key;

                                      var content = '';
                                      content += '<tr>';
                                      content += '<td>' + epochToDateTime(timestamp) + '</td>';
                                      content += '<td>' + device + '</td>';
                                      content += '<td>' + setor + '</td>';
                                      content += '<td>' + distance + '</td>';
                                      content += '</tr>';
                                      $('#tbody').append(content);
                                  }
                              });
                          }
                      });
                  });
              }

              // ...

              // Variável para controlar se o ouvinte child_added já foi adicionado
              var childAddedListenerAdded = false;

              viewDataButtonElement.addEventListener('click', (e) => {
                  // Alterna os elementos DOM
                  tableContainerElement.style.display = 'block';
                  viewDataButtonElement.style.display = 'none';
                  hideDataButtonElement.style.display = 'inline-block';
                  loadDataButtonElement.style.display = 'inline-block';

                  // Adicionar ouvinte child_added apenas uma vez
                  if (!childAddedListenerAdded) {
                      // Obter as leituras mais recentes e adicionar à tabela
                      dbRef.orderByKey().limitToLast(10).on('child_added', parentSnapshot => {
                          parentSnapshot.forEach(childSnapshot => {
                              if (childSnapshot.exists()) {
                                  var jsonData = childSnapshot.toJSON();
                                  console.log(jsonData);
                                  var setor = jsonData.setor;
                                  var timestamp = jsonData.timestamp;
                                  var distance = jsonData.distance;
                                  var device = childSnapshot.ref.key;
                                  var content = '';
                                  content += '<tr>';
                                  content += '<td>' + epochToDateTime(timestamp) + '</td>';
                                  content += '<td>' + device + '</td>';
                                  content += '<td>' + setor + '</td>';
                                  content += '<td>' + distance + '</td>';
                                  content += '</tr>';

                                  $('#tbody').prepend(content);
                              }
                          });
                      });

                      childAddedListenerAdded = true; // Marcar que o ouvinte foi adicionado
                  }
              });

              loadDataButtonElement.addEventListener('click', (e) => {
                  appendToTable();
              });

              hideDataButtonElement.addEventListener('click', (e) => {
                  tableContainerElement.style.display = 'none';
                  viewDataButtonElement.style.display = 'inline-block';
                  hideDataButtonElement.style.display = 'none';
              });
  
              // Se o usuário está deslogado
          } else {
              // alterna os elementos da interface
              loginElement.style.display = 'block';
              authBarElement.style.display = 'none';
              userDetailsElement.style.display = 'none';
              contentElement.style.display = 'none';
              sideBarElement.style.display = 'none';
              loginElement.style.top = "300px";
              loginElement.style.left = "-80px";
              elementoNovo.style.display = 'none';

          }
      }