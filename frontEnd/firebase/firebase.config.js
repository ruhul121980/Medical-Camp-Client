// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8t_Fs_YJzAZ2doLfLClrU2fI9PV_pNgI",
  authDomain: "medi-camp-77c1e.firebaseapp.com",
  projectId: "medi-camp-77c1e",
  storageBucket: "medi-camp-77c1e.appspot.com",
  messagingSenderId: "247116490073",
  appId: "1:247116490073:web:08d97a2bd88e4b9c951848"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;



