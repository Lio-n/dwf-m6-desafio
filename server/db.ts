import * as admin from "firebase-admin"; // Libreria
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }), // Me Autentifico
  databaseURL: "https://apx-m6-desafio-default-rtdb.firebaseio.com/", // Direccion de mi Proyecto "apx-dwf-m6"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
