// Firebase configuration
var config = {
  apiKey: "AIzaSyCCUaH1bW1oB7kgPUkIqRLI2-RCPyODvOo",
  authDomain: "actor-dex-final.firebaseapp.com",
  databaseURL: "https://actor-dex-final.firebaseio.com",
  storageBucket: "actor-dex-final.appspot.com",
  messagingSenderId: "810520072391"
};

// Initialize FirebaseUI
var uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
  tosUrl: '<your-tos-url>'
};
