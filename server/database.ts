import * as admin  from "firebase-admin";
const serviceAccount = require ("./key.json")



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://apx-m6-df2fa-default-rtdb.firebaseio.com"
});

const baseDeDatos  = admin.firestore();
const realtimeDatabase  = admin.database();

export{baseDeDatos  , realtimeDatabase } ;
