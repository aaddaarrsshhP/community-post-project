// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4cnky9bT7C21CYCnurD7_MReZaaHkLc4",
  authDomain: "comment-b17f1.firebaseapp.com",
  projectId: "comment-b17f1",
  storageBucket: "comment-b17f1.appspot.com",
  messagingSenderId: "895064556592",
  appId: "1:895064556592:web:eea304f6f7a069c280d9f5",
  measurementId: "G-GY5ES8LERW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth = getAuth(app);
const fileStorage=getStorage(app);

export {fileStorage,auth};

export default db;
