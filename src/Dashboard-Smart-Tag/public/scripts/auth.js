document.addEventListener("DOMContentLoaded", function(){
    // listen for auth status changes
    auth.onAuthStateChanged(user => {
        if (user) {
          console.log("user logged in");
          console.log(user);
          setupUI(user);
          var uid = user.uid;
          console.log(uid);
        } else {
          console.log("user logged out");
          setupUI();
        }
    });

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm['input-email'].value;
  const password = loginForm['input-password'].value;

  auth.signInWithEmailAndPassword(email, password)
    .then((cred) => {
      loginForm.reset();
      console.log(email);
    })
    .catch((error) => {
      const errorCode = error.code;
      let errorMessage;

      switch (errorCode) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        // Adicione outros casos de erro conforme necessário

        default:
          errorMessage = 'Ocorreu um erro durante o login. Por favor, tente novamente mais tarde.';
      }

      document.getElementById("error-message").innerHTML = errorMessage;
      console.log(errorMessage);
    });
});


// logout
const logout = document.querySelector('#logout-link');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        setTimeout(() => {
            location.reload();
        }, 100);
    });
});
});