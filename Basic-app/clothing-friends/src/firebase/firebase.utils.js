import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "clothing-friends-2020.firebaseapp.com",
  databaseURL: "https://clothing-friends-2020.firebaseio.com",
  projectId: "clothing-friends-2020",
  storageBucket: "clothing-friends-2020.appspot.com",
  messagingSenderId: "489564068830",
  appId: "1:489564068830:web:bdb4580c79782290be5b4f",
  measurementId: "G-8V6CLYTZJR"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({ prompt: 'select_account' });

const signInWithGoogle = () => auth.signInWithPopup(provider);

const checkDocOrCreateDocInFirestore = async (userAuth, displayName) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (snapShot.exists) return userRef;

  else if (!snapShot.exists) {
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName: displayName,
        email: userAuth.email,
        createdAt,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
    return userRef;
  }
}

export {
  firebase,
  auth,
  firestore,
  signInWithGoogle,
  checkDocOrCreateDocInFirestore
}