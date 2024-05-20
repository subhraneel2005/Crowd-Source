import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAijafKHTIFbPs5hketzzwQrNDKr3kW3RU",
  authDomain: "crowd-source-1e395.firebaseapp.com",
  projectId: "crowd-source-1e395",
  storageBucket: "crowd-source-1e395.appspot.com",
  messagingSenderId: "228371351474",
  appId: "1:228371351474:web:ae1a4fc3b2566936b206ab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);