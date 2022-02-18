import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAugANu9DY6UaB1RnJN-c_EC39O1x2fZhQ",
    authDomain: "clone-f3600.firebaseapp.com",
    projectId: "clone-f3600",
    storageBucket: "clone-f3600.appspot.com",
    messagingSenderId: "827996931922",
    appId: "1:827996931922:web:530d056812c1833fe21c8b",
    measurementId: "G-1CRNXPQFZP"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };