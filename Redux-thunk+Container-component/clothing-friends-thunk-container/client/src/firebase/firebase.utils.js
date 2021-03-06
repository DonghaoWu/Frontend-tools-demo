import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "clothing-friends-b4556.firebaseapp.com",
  databaseURL: "https://clothing-friends-b4556.firebaseio.com",
  projectId: "clothing-friends-b4556",
  storageBucket: "clothing-friends-b4556.appspot.com",
  messagingSenderId: "129008363109",
  appId: "1:129008363109:web:2e5d438613d221172b088c",
  measurementId: "G-GNW6M88RK2"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({ prompt: 'select_account' });

const signInWithGoogle = () => auth.signInWithPopup(provider);

const checkOrCreateUserDocInFirestore = async (userAuth, displayName) => {
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
      console.log('error in creating user', error.message);
    }
    return userRef;
  }
}

const createCollectionAndDocsInFirestore = async (collectionKeyToCreate, objectsToAdd) => {
  const collectionRef = firestore.collection(collectionKeyToCreate);
  const batch = firestore.batch();

  objectsToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
}

const convertCollectionsSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export {
  firebase,
  auth,
  firestore,
  signInWithGoogle,
  checkOrCreateUserDocInFirestore,
  createCollectionAndDocsInFirestore,
  convertCollectionsSnapshotToMap
}