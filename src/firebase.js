import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCYtG3iNIUKhPGHEVAnDhIM-3_N8PrERGY",
  authDomain: "famsites.firebaseapp.com",
  databaseURL: "https://famsites.firebaseio.com",
  projectId: "famsites",
  storageBucket: "famsites.appspot.com",
  messagingSenderId: "665697277592",
  appId: "1:665697277592:web:4bced2d825dac379cba2ed"
};

const firebaseRef = firebase.initializeApp(firebaseConfig)
export default firebaseRef
