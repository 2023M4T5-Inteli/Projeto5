// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime){
    return new Date(epochTime*1000);
  }
  
  // convert time to human-readable format YYYY/MM/DD HH:MM:SS
  function epochToDateTime(epochTime){
    var epochDate = new Date(epochToJsDate(epochTime));
    var dateTime = epochDate.getDate() + "/" +
      ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
      ("00" + epochDate.getFullYear()).slice(-2) + " " +
      ("00" + epochDate.getHours()).slice(-2) + ":" +
      ("00" + epochDate.getMinutes()).slice(-2) + ":" +
      ("00" + epochDate.getSeconds()).slice(-2);
  
    return dateTime;
  }
  
  // function to plot values on charts
  function plotValues(chart, timestamp, value){
    var x = epochToJsDate(timestamp).getTime();
    var y = Number (value);
    if(chart.series[0].data.length > 40) {
      chart.series[0].addPoint([x, y], true, true, true);
    } else {
      chart.series[0].addPoint([x, y], true, false, true);
    }
  }
  
  // DOM elements
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
  const chartsRangeInputElement = document.getElementById('charts-range');
  const loadDataButtonElement = document.getElementById('load-data');
  const cardsCheckboxElement = document.querySelector('input[name=cards-checkbox]');
  const gaugesCheckboxElement = document.querySelector('input[name=gauges-checkbox]');
  const chartsCheckboxElement = document.querySelector('input[name=charts-checkbox]');
  
  // DOM elements for sensor readings
  const textoStatus = document.querySelector("#status");
  const bolinhaStatus = document.querySelector("#bolinha");
  const elementoNovo = document.getElementById("elemento-novo");
  const cardsReadingsElement = document.querySelector("#cards-div");
  const gaugesReadingsElement = document.querySelector("#gauges-div");
  const chartsDivElement = document.querySelector('#charts-div');
  const tempElement = document.getElementById("temp");
  const distanceElement = document.getElementById("distance");
  const updateElement = document.getElementById("lastUpdate")
  
  // MANAGE LOGIN/LOGOUT UI
  const setupUI = (user) => {
    if (user) {
      //toggle UI elements
      loginElement.style.display = 'none';
      contentElement.style.display = 'block';
      authBarElement.style.display ='block';
      userDetailsElement.style.display ='block';
      userDetailsElement.innerHTML = user.email;
      sideBarElement.style.display = 'block';
      homeElement.style.display = 'block';


      const btn_theme = document.querySelector(".theme-btn");
      const theme_ball = document.querySelector(".theme-ball");

      const localData = localStorage.getItem("theme");

      if (localData == null) {
        localStorage.setItem("theme", "light");
      }

      if (localData == "dark") {
        document.body.classList.add("dark-mode");
        theme_ball.classList.add("dark");
      } else if (localData == "light") {
        document.body.classList.remove("dark-mode");
        theme_ball.classList.remove("dark");
      }

      btn_theme.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        theme_ball.classList.toggle("dark");
        if (document.body.classList.contains("dark-mode")) {
          localStorage.setItem("theme", "dark");
        } else {
          localStorage.setItem("theme", "light");
        }
      });

      homeElement.style.top = "0px";
  
      // get user UID to get data from database
      var uid = user.uid;
      console.log(uid);
  
      // Database paths (with user UID)
      var dbPath = 'UsersData/' + uid.toString() + '/readings';
      var chartPath = 'UsersData/' + uid.toString() + '/charts/range';
  
      // Database references
      var dbRef = firebase.database().ref(dbPath);
      var chartRef = firebase.database().ref(chartPath);
  
      // CHARTS
      // Number of readings to plot on charts
      var chartRange = 0;
      // Get number of readings to plot saved on database (runs when the page first loads and whenever there's a change in the database)
      chartRef.on('value', snapshot =>{
        chartRange = Number(snapshot.val());
        console.log(chartRange);
        // Delete all data from charts to update with new values when a new range is selected
        chartT.destroy();
        // Render new charts to display new range of data
        chartT = createTemperatureChart();
        // Update the charts with the new range
        // Get the latest readings and plot them on charts (the number of plotted readings corresponds to the chartRange value)
        dbRef.orderByKey().limitToLast(chartRange).on('child_added', parentSnapshot => {
          // Ação para cada nó filho do caminho principal
          parentSnapshot.forEach(childSnapshot => {
            // Ação para cada nó filho dentro do nó filho do caminho principal
            var jsonData = childSnapshot.toJSON();
            // Salve os valores em variáveis e faça o plot nos gráficos
            var temperature = jsonData.temperature;
            var timestamp = jsonData.timestamp;
            plotValues(chartT, timestamp, temperature);
          });
        });
      });
  
      // Update database with new range (input field)
      chartsRangeInputElement.onchange = () =>{
        chartRef.set(chartsRangeInputElement.value);
      };
  
      //CHECKBOXES
      // Checbox (cards for sensor readings)
      cardsCheckboxElement.addEventListener('change', (e) =>{
        if (cardsCheckboxElement.checked) {
          cardsReadingsElement.style.display = 'block';
        }
        else{
          cardsReadingsElement.style.display = 'none';
        }
      });
      // Checbox (gauges for sensor readings)
      gaugesCheckboxElement.addEventListener('change', (e) =>{
        if (gaugesCheckboxElement.checked) {
          gaugesReadingsElement.style.display = 'block';
        }
        else{
          gaugesReadingsElement.style.display = 'none';
        }
      });
      // Checbox (charta for sensor readings)
      chartsCheckboxElement.addEventListener('change', (e) =>{
        if (chartsCheckboxElement.checked) {
          chartsDivElement.style.display = 'block';
        }
        else{
          chartsDivElement.style.display = 'none';
        }
      });

      const botao = document.querySelector("#dispositivos-option");
      const elementoNovo = document.getElementById("elemento-novo");
      const elementoOriginal = document.getElementById("hero-content");
      let contador = 1;
      
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
      

      // CARDS
      // Get the latest readings and display on cards
      dbRef.orderByKey().limitToLast(1).on('child_added', parentSnapshot =>{
        parentSnapshot.forEach(childSnapshot => {
        var jsonData = childSnapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
        var temperature = jsonData.temperature;
        var timestamp = jsonData.timestamp;
        // Update DOM elements
        tempElement.innerHTML = temperature;
        updateElement.innerHTML = epochToDateTime(timestamp);

        if (temperature > -70) {
          textoStatus.textContent = 'Sinal bom';
          textoStatus.style.color = 'green';
          bolinhaStatus.style.backgroundColor = 'green';
        } else {
          textoStatus.textContent = 'Sinal ruim';
          textoStatus.style.color = 'orange';
          bolinhaStatus.style.backgroundColor = 'orange';
        }
      });
      });

            // DISTANCIA
      // Get the latest readings and display on cards
      dbRef.orderByKey().limitToLast(1).on('child_added', parentSnapshot =>{
        parentSnapshot.forEach(childSnapshot => {
        var jsonData = childSnapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
        var distance = jsonData.distance;
        var timestamp = jsonData.timestamp;
        // Update DOM elements
        distanceElement.innerHTML = distance;
        updateElement.innerHTML = epochToDateTime(timestamp);
      });
    });

      // GAUGES
      // Get the latest readings and display on gauges
      dbRef.orderByKey().limitToLast(1).on('child_added', parentSnapshot =>{
        parentSnapshot.forEach(childSnapshot => {
        var jsonData = childSnapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
        var temperature = jsonData.temperature;
        var timestamp = jsonData.timestamp;
        // Update DOM elements
        var gaugeT = createTemperatureGauge();
        gaugeT.draw();
        gaugeT.value = temperature;
        updateElement.innerHTML = epochToDateTime(timestamp);
      });
    });
  
      // DELETE DATA
      // Add event listener to open modal when click on "Delete Data" button
      deleteButtonElement.addEventListener('click', e =>{
        console.log("Remove data");
        e.preventDefault;
        deleteModalElement.style.display="block";
      });
  
      // Add event listener when delete form is submited
      deleteDataFormElement.addEventListener('submit', (e) => {
        // delete data (readings)
        dbRef.remove();
      });
  
      // TABLE
      var lastReadingTimestamp; //saves last timestamp displayed on the table
      // Function that creates the table with the first 100 readings
      function createTable() {
        var firstRun = true;
        const botao = document.querySelector("#dispositivos-option");
        const elementoOriginal = document.getElementById("hero-content");
        
          // Remove o elemento original
          //elementoOriginal.style.display = "none";
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
        dbRef.orderByKey().limitToLast(100).on('child_added', function(parentSnapshot) {
          parentSnapshot.forEach(childSnapshot => {
          if (childSnapshot.exists()) {
            var jsonData = childSnapshot.toJSON();
            console.log(jsonData);
            var temperature = jsonData.temperature;
            var distance = jsonData.distance;
            var timestamp = jsonData.timestamp;
            var device = childSnapshot.ref.key;
            var content = '';
            content += '<tr>';
            content += '<td>' + epochToDateTime(timestamp) + '</td>';
            content += '<td>' + temperature + '</td>';
            content += '</tr>';

            var novoBotao2 = '';
            novoBotao2 += '<button class="cssbuttons-io-button">'
            novoBotao2 += '<span class="button-text">'+device+'<br><span>'+distance+' metros de distância do roteador</span></span>'
            novoBotao2 += '</div>'
            $('#tbody').prepend(content);
            $(elementoNovo).prepend(novoBotao2);
    
      
            if (firstRun) {
              lastReadingTimestamp = timestamp;
              firstRun = false;
              console.log(lastReadingTimestamp);
            }
          }
        });
      });
      }
      
  
      // append readings to table (after pressing More results... button)
      function appendToTable(){
        var dataList = []; // saves list of readings returned by the snapshot (oldest-->newest)
        var reversedList = []; // the same as previous, but reversed (newest--> oldest)
        console.log("APEND");
        dbRef.orderByKey().limitToLast(100).endAt(lastReadingTimestamp).once('value', function(parentSnapshot) {
          parentSnapshot.forEach(childSnapshot => {
          // convert the snapshot to JSON
          if (childSnapshot.exists()) {
            parentSnapshot.forEach(childElement => {
              var jsonData = childElement.toJSON();
              dataList.push(jsonData); // create a list with all data
            });
            lastReadingTimestamp = dataList[0].timestamp; //oldest timestamp corresponds to the first on the list (oldest --> newest)
            reversedList = dataList.reverse(); // reverse the order of the list (newest data --> oldest data)
  
            var firstTime = true;
            // loop through all elements of the list and append to table (newest elements first)
            reversedList.forEach(childElement =>{
              if (firstTime){ // ignore first reading (it's already on the table from the previous query)
                firstTime = false;
              }
              else{
                var temperature = childElement.temperature;
                var timestamp = childElement.timestamp;
                var content = '';
                content += '<tr>';
                content += '<td>' + epochToDateTime(timestamp) + '</td>';
                content += '<td>' + temperature + '</td>';
                content += '</tr>';
                $('#tbody').append(content);
              }
            });
          }
        });
      });
      }
  
      viewDataButtonElement.addEventListener('click', (e) =>{
        // Toggle DOM elements
        tableContainerElement.style.display = 'block';
        viewDataButtonElement.style.display ='none';
        hideDataButtonElement.style.display ='inline-block';
        loadDataButtonElement.style.display = 'inline-block'
        createTable();
      });
  
      loadDataButtonElement.addEventListener('click', (e) => {
        appendToTable();
      });
  
      hideDataButtonElement.addEventListener('click', (e) => {
        tableContainerElement.style.display = 'none';
        viewDataButtonElement.style.display = 'inline-block';
        hideDataButtonElement.style.display = 'none';
      });
  
    // IF USER IS LOGGED OUT
    } else{
      // toggle UI elements
      loginElement.style.display = 'block';
      authBarElement.style.display ='none';
      userDetailsElement.style.display ='none';
      contentElement.style.display = 'none';
      sideBarElement.style.display = 'none';
      loginElement.style.top = "350px";
      elementoNovo.style.display = 'none';
    }
  }