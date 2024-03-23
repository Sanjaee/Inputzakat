// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHbYyzdb8eXevMgp0537n7MCB-ql_SMRk",
  authDomain: "zakat-c8687.firebaseapp.com",
  projectId: "zakat-c8687",
  storageBucket: "zakat-c8687.appspot.com",
  messagingSenderId: "595136108499",
  appId: "1:595136108499:web:c86d82463d3c4302eb4126",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
