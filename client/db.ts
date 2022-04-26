import { initializeApp } from "firebase/app";

const firebaseConfig = ({
    apiKey: "yy4zSz7uHsin7E93XAu7lpmSsHgPKR3eukeI6rW1",
    databaseURL:"https://apx-m6-df2fa-default-rtdb.firebaseio.com",
    authDomain:"apx-m6-df2fa.firebaseapp.com"
    });


    const rtdb = initializeApp(firebaseConfig);


    export {rtdb}