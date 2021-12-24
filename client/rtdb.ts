import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "nxzCsgTHMQyiZorgBOpIZYCr3JQVuezrlhT5215g",
  databaseURL: "https://apx-m6-desafio-default-rtdb.firebaseio.com/",
  authDomain: "apx-dwf-m6-desadio.firebaseapp.com",
});

const rtdb = firebase.database();
export { rtdb };
