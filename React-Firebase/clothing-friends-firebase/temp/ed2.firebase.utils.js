import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDN4tbAvlaC3zxQjN4vUw0bX8AmGFCa9co",
  authDomain: "clothing-friends.firebaseapp.com",
  databaseURL: "https://clothing-friends.firebaseio.com",
  projectId: "clothing-friends",
  storageBucket: "clothing-friends.appspot.com",
  messagingSenderId: "602150897422",
  appId: "1:602150897422:web:e7efaca1dff7f74802b95f",
  measurementId: "G-8D7LR6M67M"
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