// Firebase configuration
var config = {
  apiKey: "AIzaSyDbFs8Xco-rBHBgovEIzMDy2s3bYGzuE_w",
  authDomain: "actor-dex.firebaseapp.com",
  databaseURL: "https://actor-dex.firebaseio.com",
  storageBucket: "actor-dex.appspot.com",
  messagingSenderId: "162028654830"
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
