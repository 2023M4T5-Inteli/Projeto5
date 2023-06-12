// Função para verificar o status de autenticação do Firebase
function checkAuthState() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // O usuário está logado, redirecione para a página principal
        window.location.href = "index.html";
      } else {
        // O usuário não está logado, exiba a tela de login
        document.getElementById("login-form").style.display = "block";
      }
    });
  }
  
  // Função para lidar com o envio do formulário de login
  function handleLoginFormSubmit(e) {
    e.preventDefault(); // Impede o envio do formulário
  
    var email = document.getElementById("input-email").value;
    var password = document.getElementById("input-password").value;
  
    // Autentica o usuário usando o Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function() {
        // Login bem-sucedido, redirecione para a página principal
        window.location.href = "index.html";
      })
      .catch(function(error) {
        // Tratamento de erros durante o login
        var errorMessage = error.message;
        document.getElementById("error-message").innerText = errorMessage;
      });
  }
  
  // Adiciona o manipulador de eventos para o envio do formulário de login
  document.getElementById("login-form").addEventListener("submit", handleLoginFormSubmit);
  