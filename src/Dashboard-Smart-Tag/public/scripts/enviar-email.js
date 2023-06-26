const firebase = require('firebase');
const nodemailer = require('nodemailer');

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

firebase.initializeApp(firebaseConfig);

// Configurações do Nodemailer (usando o Gmail como exemplo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'EMAIL@gmail.com',
    pass: 'SENHA-EMAIL',
  },
});

// Monitorar a variável "HouveMudança"
const database = firebase.database();
var dbPath = 'UsersData/' + uid.toString() + '/readings';

// Database references
var dbRef = firebase.database().ref(dbPath);

dbRef.orderByKey().limitToLast(1000000).on('value', (snapshot) => {
  snapshot.forEach((parentSnapshot) => {
    parentSnapshot.forEach((childSnapshot) => {
      if (childSnapshot.exists()) {
        const jsonData = childSnapshot.val();
        const houveMudanca = jsonData.houveMudanca;

        if (houveMudanca === 'Não') {
          // Configurações do e-mail
          const mailOptions = {
            from: 'EMAIL@gmail.com',
            to: 'EMAIL@gmail.com',
            subject: 'Houve mudança!',
            text: 'A variável "HouveMudança" foi atualizada para "Sim".',
          };

          // Enviar o e-mail
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Erro ao enviar o e-mail:', error);
            } else {
              console.log('E-mail enviado:', info.response);
            }
          });
        }
      }
    });
  });
});