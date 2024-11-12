// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB18ybrcmLptt0CUKz8AqESVcIpaQoTQF4",
  authDomain: "beeriokart-7cf0b.firebaseapp.com",
  projectId: "beeriokart-7cf0b",
  storageBucket: "beeriokart-7cf0b.firebasestorage.app",
  messagingSenderId: "1066321398036",
  appId: "1:1066321398036:web:1dcd7ff041e8e08c1e1a01",
  measurementId: "G-5JVTK7T1Y2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;