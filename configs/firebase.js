import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCC7xRf0xYNeVR7Elemy49YUhxHKzE5LM",
  authDomain: "socialweb-ce3cd.firebaseapp.com",
  projectId: "socialweb-ce3cd",
  storageBucket: "socialweb-ce3cd.appspot.com",
  messagingSenderId: "91159041297",
  appId: "1:91159041297:web:edce230d3b68e2240d28b0",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);

export {
  storage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  firebase as default,
};
