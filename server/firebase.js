// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuHG1dh5FJkudgLo0VNbcVIR1R2W7INAo",
  authDomain: "uploadingfile-1f51f.firebaseapp.com",
  projectId: "uploadingfile-1f51f",
  storageBucket: "uploadingfile-1f51f.appspot.com",
  messagingSenderId: "103426570948",
  appId: "1:103426570948:web:13302f4ae047871aeb6791"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)